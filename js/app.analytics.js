(function () {
  const modules = (window.AppModules = window.AppModules || {});

  modules.initAnalytics = function initAnalytics(ctx, state) {
    const safeCall = (fn) => {
      try {
        fn();
      } catch (error) {
        // ignore tracking errors
      }
    };
    let lastTrackedUrl = "";
    let umamiWebsiteId = null;

    const normalizeUrl = (url) => {
      if (typeof window === "undefined") return "";
      if (!url || typeof url !== "string") {
        return `${window.location.pathname}${window.location.search || ""}`;
      }
      return url;
    };

    const normalizePath = (path) => {
      if (!path || typeof path !== "string") return "";
      if (/^https?:\/\//i.test(path)) {
        try {
          const parsed = new URL(path);
          return `${parsed.pathname}${parsed.search || ""}`;
        } catch (error) {
          return "";
        }
      }
      return path;
    };

    const toAbsoluteUrl = (url) => {
      if (typeof window === "undefined") return url;
      if (!url) return window.location.href;
      if (/^https?:\/\//i.test(url)) return url;
      return `${window.location.origin}${url}`;
    };

    const getUmamiWebsiteId = () => {
      if (umamiWebsiteId !== null) return umamiWebsiteId;
      if (typeof document === "undefined") {
        umamiWebsiteId = "";
        return umamiWebsiteId;
      }
      const script = document.querySelector("script[data-website-id]");
      umamiWebsiteId = script ? script.getAttribute("data-website-id") || "" : "";
      return umamiWebsiteId;
    };

    const trackUmamiPageview = (url, title) => {
      if (typeof window === "undefined") return;
      if (!window.umami) return;
      const website = getUmamiWebsiteId();
      if (typeof window.umami.trackView === "function") {
        safeCall(() => window.umami.trackView(url, title));
        return;
      }
      if (typeof window.umami.track !== "function") return;
      const payload = website ? { url, title, website } : { url, title };
      safeCall(() => window.umami.track(payload));
    };

    const trackPageview = (payload) => {
      if (typeof window === "undefined") return;
      const url = normalizeUrl(payload && payload.url);
      const path = normalizePath(payload && payload.path) || normalizePath(url) || url;
      const dedupeKey = path || url;
      if (!dedupeKey || dedupeKey === lastTrackedUrl) return;
      lastTrackedUrl = dedupeKey;

      const title =
        (payload && payload.title) || document.title || "Endfield Essence Planner";
      const location = toAbsoluteUrl(url);

      trackUmamiPageview(path || url, title);

      if (typeof window.gtag === "function") {
        safeCall(() =>
          window.gtag("event", "page_view", {
            page_path: path || url,
            page_location: location,
            page_title: title,
          })
        );
      }

      if (Array.isArray(window._hmt)) {
        safeCall(() => window._hmt.push(["_trackPageview", path || url]));
      }

      if (typeof window.clarity === "function") {
        safeCall(() => window.clarity("set", "page", path || url));
        safeCall(() => window.clarity("set", "pageTitle", title));
      }
    };

    const defaultTrackEvent = (name, data) => {
      if (typeof window === "undefined") return;
      if (!window.umami || typeof window.umami.track !== "function") return;
      const payload = data && typeof data === "object" ? { ...data } : {};
      const website = getUmamiWebsiteId();
      if (website && !payload.website) {
        payload.website = website;
      }
      safeCall(() => window.umami.track(name, payload));
    };

    state.trackPageview = trackPageview;
    state.trackEvent = state.trackEvent || defaultTrackEvent;
  };
})();
