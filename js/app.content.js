(function () {
  const modules = (window.AppModules = window.AppModules || {});

  modules.initContent = function initContent(ctx, state) {
    const { computed } = ctx;

    const content = window.CONTENT || {};
    const sponsorEntries = Array.isArray(window.SPONSORS) ? window.SPONSORS : [];
    const fallbackLocale = state.fallbackLocale || "zh-CN";
    const t = state.t || ((value) => value);

    const normalizeSponsorList = (list) => {
      if (!Array.isArray(list)) return [];
      return list
        .map((entry) => {
          if (!entry) return null;
          if (typeof entry === "string") return { name: entry };
          if (typeof entry === "object") {
            const name = entry.name || entry.title || entry.label;
            if (!name) return null;
            return {
              name,
              amount: entry.amount || entry.money || "",
              note: entry.note || entry.message || "",
              date: entry.date || "",
            };
          }
          return null;
        })
        .filter(Boolean);
    };

    const getContentForLocale = (targetLocale) => {
      const base = {
        announcement: content.announcement || {},
        changelog: content.changelog || {},
        about: content.about || {},
      };
      if (!content.locales || targetLocale === fallbackLocale) return base;
      const localized = content.locales[targetLocale] || {};
      return {
        announcement: { ...base.announcement, ...(localized.announcement || {}) },
        changelog: { ...base.changelog, ...(localized.changelog || {}) },
        about: { ...base.about, ...(localized.about || {}) },
      };
    };

    const localizedContent = computed(() => getContentForLocale(state.locale.value));
    const defaultAnnouncement = computed(() => ({
      version: "",
      title: t("公告"),
      date: "",
      qqGroup: "",
      qqNote: "",
      items: [],
    }));
    const announcement = computed(() => ({
      ...defaultAnnouncement.value,
      ...(localizedContent.value.announcement || {}),
    }));
    const defaultChangelog = computed(() => ({
      title: t("更新日志"),
      entries: [],
    }));
    const changelog = computed(() => ({
      ...defaultChangelog.value,
      ...(localizedContent.value.changelog || {}),
    }));
    const defaultAbout = computed(() => ({
      title: t("关于本工具"),
      paragraphs: [],
      author: "",
      links: [],
      thanks: [],
    }));
    const aboutContent = computed(() => {
      const base = {
        ...defaultAbout.value,
        ...(localizedContent.value.about || {}),
      };
      const list = normalizeSponsorList((base.sponsor && base.sponsor.list) || sponsorEntries);
      const items =
        (base.sponsor && Array.isArray(base.sponsor.items) && base.sponsor.items) || [];
      if (items.length) base.sponsor = { ...(base.sponsor || {}), items };
      if (list.length) {
        base.sponsor = { ...(base.sponsor || {}), list };
      }
      return base;
    });

    state.content = content;
    state.announcement = announcement;
    state.changelog = changelog;
    state.aboutContent = aboutContent;
  };
})();
