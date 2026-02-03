(function () {
  const { createApp, ref, computed, onMounted, onBeforeUnmount, watch, nextTick } = Vue || {};

  if (!createApp) {
    finishPreload();
    document.body.innerHTML =
      "<div style='padding:24px;color:#f36c6c;font-family:Microsoft YaHei UI;'>未找到 Vue 3 本地文件：请将 vue.global.prod.js 放入 ./vendor/</div>";
    return;
  }

  if (!dungeons.length || !weapons.length) {
    finishPreload();
    document.body.innerHTML =
      "<div style='padding:24px;color:#f36c6c;font-family:Microsoft YaHei UI;'>缺少数据文件：请确认 ./data/dungeons.js 与 ./data/weapons.js</div>";
    return;
  }

  const modules = window.AppModules || {};

  createApp({
    setup() {
      const ctx = { ref, computed, onMounted, onBeforeUnmount, watch, nextTick };
      const state = {};
      const init = (name) => {
        const fn = modules[name];
        if (typeof fn === "function") {
          fn(ctx, state);
        }
      };

      init("initState");
      init("initI18n");
      init("initContent");
      init("initSearch");
      init("initUi");
      init("initStorage");
      init("initEmbed");
      init("initPerf");
      init("initBackground");
      init("initWeapons");
      init("initRecommendations");
      init("initTutorial");
      init("initRecommendationDisplay");
      init("initModals");
      init("initMedia");

      return {
        locale: state.locale,
        languageOptions: state.languageOptions,
        langSwitchRef: state.langSwitchRef,
        showLangMenu: state.showLangMenu,
        langMenuPlacement: state.langMenuPlacement,
        toggleLangMenu: state.toggleLangMenu,
        setLocale: state.setLocale,
        t: state.t,
        tTerm: state.tTerm,
        showAiNotice: state.showAiNotice,
        searchQuery: state.searchQuery,
        selectedNames: state.selectedNames,
        selectedWeaponRows: state.selectedWeaponRows,
        selectedWeapons: state.selectedWeapons,
        selectedNameSet: state.selectedNameSet,
        isExcluded: state.isExcluded,
        toggleExclude: state.toggleExclude,
        getWeaponNote: state.getWeaponNote,
        updateWeaponNote: state.updateWeaponNote,
        toggleShowWeaponAttrs: state.toggleShowWeaponAttrs,
        showWeaponAttrs: state.showWeaponAttrs,
        showAttrHint: state.showAttrHint,
        dismissAttrHint: state.dismissAttrHint,
        showFilterPanel: state.showFilterPanel,
        showAllSchemes: state.showAllSchemes,
        showBackToTop: state.showBackToTop,
        scrollToTop: state.scrollToTop,
        tutorialActive: state.tutorialActive,
        tutorialStep: state.tutorialStep,
        tutorialVisibleLines: state.tutorialVisibleLines,
        tutorialStepIndex: state.tutorialStepIndex,
        tutorialTotalSteps: state.tutorialTotalSteps,
        tutorialStepKey: state.tutorialStepKey,
        tutorialStepReady: state.tutorialStepReady,
        tutorialWeapon: state.tutorialWeapon,
        tutorialExcluded: state.tutorialExcluded,
        tutorialNote: state.tutorialNote,
        tutorialBodyCanCollapse: state.tutorialBodyCanCollapse,
        tutorialBodyCollapsed: state.tutorialBodyCollapsed,
        tutorialCollapseHighlight: state.tutorialCollapseHighlight,
        tutorialSkipAll: state.tutorialSkipAll,
        showTutorialSkipConfirm: state.showTutorialSkipConfirm,
        showTutorialComplete: state.showTutorialComplete,
        tutorialTargetSchemeKey: state.tutorialTargetSchemeKey,
        isTutorialGuideWeapon: state.isTutorialGuideWeapon,
        isPortrait: state.isPortrait,
        startTutorial: state.startTutorial,
        nextTutorialStep: state.nextTutorialStep,
        prevTutorialStep: state.prevTutorialStep,
        skipTutorialStep: state.skipTutorialStep,
        skipTutorialAll: state.skipTutorialAll,
        openTutorialSkipConfirm: state.openTutorialSkipConfirm,
        closeTutorialSkipConfirm: state.closeTutorialSkipConfirm,
        confirmTutorialSkipAll: state.confirmTutorialSkipAll,
        closeTutorialComplete: state.closeTutorialComplete,
        finishTutorial: state.finishTutorial,
        toggleTutorialBody: state.toggleTutorialBody,
        toggleTutorialExclude: state.toggleTutorialExclude,
        updateTutorialNote: state.updateTutorialNote,
        markTutorialNoteTouched: state.markTutorialNoteTouched,
        tutorialWeaponTarget: state.tutorialWeaponTarget,
        tutorialSchemeTarget: state.tutorialSchemeTarget,
        tutorialPlansTab: state.tutorialPlansTab,
        filterS1: state.filterS1,
        filterS2: state.filterS2,
        filterS3: state.filterS3,
        s1Options: state.s1Options,
        s2Options: state.s2Options,
        s3OptionEntries: state.s3OptionEntries,
        toggleFilterValue: state.toggleFilterValue,
        clearAttributeFilters: state.clearAttributeFilters,
        hasAttributeFilters: state.hasAttributeFilters,
        filteredWeapons: state.filteredWeapons,
        recommendations: state.recommendations,
        coverageSummary: state.coverageSummary,
        primaryRecommendations: state.primaryRecommendations,
        extraRecommendations: state.extraRecommendations,
        visibleRecommendations: state.visibleRecommendations,
        displayRecommendations: state.displayRecommendations,
        displayDividerIndex: state.displayDividerIndex,
        fallbackPlan: state.fallbackPlan,
        toggleWeapon: state.toggleWeapon,
        toggleSchemeBasePick: state.toggleSchemeBasePick,
        isConflictOpen: state.isConflictOpen,
        toggleConflictOpen: state.toggleConflictOpen,
        clearSelection: state.clearSelection,
        formatS1: state.formatS1,
        rarityBadgeStyle: state.rarityBadgeStyle,
        rarityTextStyle: state.rarityTextStyle,
        hasImage: state.hasImage,
        weaponImageSrc: state.weaponImageSrc,
        weaponCharacters: state.weaponCharacters,
        characterImageSrc: state.characterImageSrc,
        handleCharacterImageError: state.handleCharacterImageError,
        announcement: state.announcement,
        changelog: state.changelog,
        aboutContent: state.aboutContent,
        showAbout: state.showAbout,
        showNotice: state.showNotice,
        showChangelog: state.showChangelog,
        skipNotice: state.skipNotice,
        openNotice: state.openNotice,
        closeNotice: state.closeNotice,
        appReady: state.appReady,
        mobilePanel: state.mobilePanel,
        showDomainWarning: state.showDomainWarning,
        currentHost: state.currentHost,
        embedHostLabel: state.embedHostLabel,
        isEmbedTrusted: state.isEmbedTrusted,
        isEmbedded: state.isEmbedded,
        warningCountdown: state.warningCountdown,
        dismissDomainWarning: state.dismissDomainWarning,
        lowGpuEnabled: state.lowGpuEnabled,
        perfPreference: state.perfPreference,
        showSecondaryMenu: state.showSecondaryMenu,
        showPerfNotice: state.showPerfNotice,
        setPerfMode: state.setPerfMode,
        customBackground: state.customBackground,
        customBackgroundName: state.customBackgroundName,
        customBackgroundError: state.customBackgroundError,
        customBackgroundApi: state.customBackgroundApi,
        handleBackgroundFile: state.handleBackgroundFile,
        clearCustomBackground: state.clearCustomBackground,
      };
    },
  }).mount("#app");
})();
