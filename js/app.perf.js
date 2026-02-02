(function () {
  const modules = (window.AppModules = window.AppModules || {});

  modules.initPerf = function initPerf(ctx, state) {
    const { onMounted } = ctx;

    const perfAutoCooldownMs = 2500;
    let perfAutoBlockedUntil = 0;
    let perfProbeRunning = false;
    let perfLagTimer = null;
    let perfLagTimeout = null;
    let longTaskObserver = null;

    const applyLowGpuMode = (enabled) => {
      state.lowGpuEnabled.value = enabled;
      document.documentElement.classList.toggle("low-gpu", enabled);
    };

    const readPerfMode = () => {
      try {
        const value = localStorage.getItem(state.perfModeStorageKey) || "";
        return value === "off" ? "standard" : value;
      } catch (error) {
        return "";
      }
    };

    const writePerfMode = (value) => {
      try {
        if (value) {
          localStorage.setItem(state.perfModeStorageKey, value);
        } else {
          localStorage.removeItem(state.perfModeStorageKey);
        }
      } catch (error) {
        // ignore storage errors
      }
    };

    const blockAutoSwitch = (durationMs) => {
      perfAutoBlockedUntil = Math.max(
        perfAutoBlockedUntil,
        performance.now() + (durationMs || 0)
      );
    };

    const canAutoSwitch = () => {
      if (document.visibilityState && document.visibilityState !== "visible") {
        return false;
      }
      return performance.now() >= perfAutoBlockedUntil;
    };

    const autoSwitchToLowGpu = () => {
      if (state.perfPreference.value !== "auto" || state.lowGpuEnabled.value) return;
      if (!canAutoSwitch()) return;
      applyLowGpuMode(true);
      state.showPerfNotice.value = true;
    };

    const stopAutoMonitors = () => {
      if (perfLagTimer) {
        clearInterval(perfLagTimer);
        perfLagTimer = null;
      }
      if (perfLagTimeout) {
        clearTimeout(perfLagTimeout);
        perfLagTimeout = null;
      }
      if (longTaskObserver) {
        longTaskObserver.disconnect();
        longTaskObserver = null;
      }
    };

    const startPerfProbe = (durationMs = 1200) => {
      if (perfProbeRunning || state.perfPreference.value !== "auto") return;
      perfProbeRunning = true;
      let frames = 0;
      let total = 0;
      let last = performance.now();
      const start = last;
      const step = (now) => {
        total += now - last;
        frames += 1;
        last = now;
        if (now - start < durationMs) {
          requestAnimationFrame(step);
          return;
        }
        perfProbeRunning = false;
        const avg = total / Math.max(frames, 1);
        if (avg > 40 && state.perfPreference.value === "auto") {
          autoSwitchToLowGpu();
        }
      };
      requestAnimationFrame(step);
    };

    const startLagMonitor = (durationMs = 8000, intervalMs = 200) => {
      if (state.perfPreference.value !== "auto" || perfLagTimer) return;
      let last = performance.now();
      perfLagTimer = setInterval(() => {
        const now = performance.now();
        const lag = Math.max(0, now - last - intervalMs);
        last = now;
        if (lag > 120) {
          autoSwitchToLowGpu();
        }
      }, intervalMs);
      perfLagTimeout = setTimeout(() => {
        if (perfLagTimer) {
          clearInterval(perfLagTimer);
          perfLagTimer = null;
        }
        perfLagTimeout = null;
      }, durationMs);
    };

    const startLongTaskObserver = () => {
      if (state.perfPreference.value !== "auto" || longTaskObserver) return;
      if (typeof PerformanceObserver === "undefined") return;
      try {
        longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.some((entry) => entry.duration >= 200)) {
            autoSwitchToLowGpu();
            stopAutoMonitors();
          }
        });
        longTaskObserver.observe({ entryTypes: ["longtask"] });
      } catch (error) {
        longTaskObserver = null;
      }
    };

    const startAutoMonitors = () => {
      if (state.perfPreference.value !== "auto") return;
      startPerfProbe();
      startLagMonitor();
      startLongTaskObserver();
    };

    const initPerfMode = () => {
      const pref = readPerfMode();
      if (pref === "low") {
        state.perfPreference.value = "low";
        applyLowGpuMode(true);
        return;
      }
      if (pref === "standard") {
        state.perfPreference.value = "standard";
        applyLowGpuMode(false);
        return;
      }
      state.perfPreference.value = "auto";
      blockAutoSwitch(perfAutoCooldownMs);
      startAutoMonitors();
      const onUserActivity = (event) => {
        if (readPerfMode()) {
          window.removeEventListener("scroll", onUserActivity);
          window.removeEventListener("wheel", onUserActivity);
          window.removeEventListener("pointerdown", onUserActivity);
          window.removeEventListener("keydown", onUserActivity);
          window.removeEventListener("touchstart", onUserActivity);
          return;
        }
        if (event && typeof event.timeStamp === "number") {
          const delay = performance.now() - event.timeStamp;
          if (delay > 150 && delay < 60000) {
            autoSwitchToLowGpu();
          }
        }
        startAutoMonitors();
      };
      window.addEventListener("scroll", onUserActivity, { passive: true });
      window.addEventListener("wheel", onUserActivity, { passive: true });
      window.addEventListener("pointerdown", onUserActivity);
      window.addEventListener("keydown", onUserActivity);
      window.addEventListener("touchstart", onUserActivity, { passive: true });
    };

    const setPerfMode = (mode) => {
      state.perfPreference.value = mode;
      state.showPerfNotice.value = false;
      if (mode === "low") {
        applyLowGpuMode(true);
        writePerfMode("low");
        stopAutoMonitors();
        return;
      }
      if (mode === "standard") {
        applyLowGpuMode(false);
        writePerfMode("standard");
        stopAutoMonitors();
        return;
      }
      writePerfMode("");
      applyLowGpuMode(false);
      stopAutoMonitors();
      blockAutoSwitch(perfAutoCooldownMs);
      startAutoMonitors();
    };

    onMounted(() => {
      initPerfMode();
    });

    state.setPerfMode = setPerfMode;
  };
})();
