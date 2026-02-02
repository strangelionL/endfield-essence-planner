(function () {
  const modules = (window.AppModules = window.AppModules || {});

  modules.initModals = function initModals(ctx, state) {
    const { watch, onMounted } = ctx;

    const readNoticeSkipVersion = () => {
      try {
        return localStorage.getItem(state.noticeSkipKey) || "";
      } catch (error) {
        return "";
      }
    };

    const writeNoticeSkipVersion = (version) => {
      try {
        if (version) {
          localStorage.setItem(state.noticeSkipKey, version);
        } else {
          localStorage.removeItem(state.noticeSkipKey);
        }
      } catch (error) {
        // ignore storage errors
      }
    };

    const cleanupLegacyNoticeKeys = () => {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (key && key.startsWith(state.legacyNoticePrefix)) {
            keys.push(key);
          }
        }
        keys.forEach((key) => localStorage.removeItem(key));
      } catch (error) {
        // ignore storage errors
      }
    };

    const openNotice = () => {
      state.skipNotice.value =
        readNoticeSkipVersion() === (state.announcement.value || {}).version;
      state.showNotice.value = true;
    };

    const closeNotice = () => {
      state.showNotice.value = false;
      const currentVersion = (state.announcement.value || {}).version;
      if (state.skipNotice.value) {
        writeNoticeSkipVersion(currentVersion);
        return;
      }
      if (readNoticeSkipVersion() === currentVersion) {
        writeNoticeSkipVersion("");
      }
    };

    let scrollLockActive = false;
    let scrollLockY = 0;
    const setModalScrollLock = (locked) => {
      if (typeof window === "undefined") return;
      const root = document.documentElement;
      const body = document.body;
      if (locked) {
        if (scrollLockActive) return;
        scrollLockActive = true;
        scrollLockY = window.scrollY || window.pageYOffset || 0;
        const scrollbarGap = window.innerWidth - root.clientWidth;
        if (scrollbarGap > 0) {
          body.style.paddingRight = `${scrollbarGap}px`;
        }
        body.style.position = "fixed";
        body.style.top = `-${scrollLockY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        root.classList.add("modal-open");
        body.classList.add("modal-open");
        return;
      }
      if (!scrollLockActive) return;
      scrollLockActive = false;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.paddingRight = "";
      root.classList.remove("modal-open");
      body.classList.remove("modal-open");
      if (scrollLockY) {
        window.scrollTo(0, scrollLockY);
      }
    };

    onMounted(() => {
      cleanupLegacyNoticeKeys();
      const skippedVersion = readNoticeSkipVersion();
      if (skippedVersion !== (state.announcement.value || {}).version) {
        state.skipNotice.value = false;
        state.showNotice.value = true;
      }
      if (typeof state.maybeAutoStartTutorial === "function") {
        state.maybeAutoStartTutorial();
      }
    });

    watch(
      [state.showNotice, state.showChangelog, state.showAbout, state.showTutorialSkipConfirm],
      ([noticeOpen, changelogOpen, aboutOpen, skipOpen]) => {
        setModalScrollLock(Boolean(noticeOpen || changelogOpen || aboutOpen || skipOpen));
      },
      { immediate: true }
    );

    watch(
      [state.showNotice, state.showChangelog, state.showAbout, state.showDomainWarning],
      () => {
        if (typeof state.maybeAutoStartTutorial === "function") {
          state.maybeAutoStartTutorial();
        }
      },
      { immediate: true }
    );

    state.openNotice = openNotice;
    state.closeNotice = closeNotice;
  };
})();
