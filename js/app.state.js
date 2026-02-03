(function () {
  const modules = (window.AppModules = window.AppModules || {});

  modules.initState = function initState(ctx, state) {
    const { ref } = ctx;

    state.searchQuery = ref("");
    state.selectedNames = ref([]);
    state.schemeBaseSelections = ref({});
    state.weaponMarks = ref({});
    state.showAbout = ref(false);
    state.showSecondaryMenu = ref(false);

    state.marksStorageKey = "weapon-marks:v1";
    state.legacyExcludedKey = "excluded-notes:v1";
    state.tutorialStorageKey = "planner-tutorial:v1";
    state.uiStateStorageKey = "planner-ui-state:v1";
    state.attrHintStorageKey = "planner-attr-hint:v1";
    state.noticeSkipKey = "announcement:skip";
    state.legacyNoticePrefix = "announcement:skip:";
    state.perfModeStorageKey = "planner-perf-mode:v1";
    state.langStorageKey = "planner-lang";
    state.backgroundStorageKey = "planner-bg-image:v1";
    state.backgroundApiStorageKey = "planner-bg-api:v1";

    state.lowGpuEnabled = ref(false);
    state.perfPreference = ref("auto");
    state.showPerfNotice = ref(false);

    state.customBackground = ref("");
    state.customBackgroundName = ref("");
    state.customBackgroundError = ref("");
    state.customBackgroundApi = ref("");

    state.showNotice = ref(false);
    state.showChangelog = ref(false);
    state.skipNotice = ref(false);

    state.appReady = ref(false);
    state.mobilePanel = ref("weapons");
    state.showWeaponAttrs = ref(false);
    state.showAttrHint = ref(false);
    state.showFilterPanel = ref(true);
    state.showAllSchemes = ref(false);
    state.conflictOpenMap = ref({});
    state.showBackToTop = ref(false);

    state.tutorialVersion = "1.0.0";
    state.tutorialActive = ref(false);
    state.tutorialStepIndex = ref(0);
    state.tutorialSkippedVersion = ref("");
    state.tutorialCompletedVersion = ref("");
    state.showTutorialSkipConfirm = ref(false);
    state.showTutorialComplete = ref(false);

    state.filterS1 = ref([]);
    state.filterS2 = ref([]);
    state.filterS3 = ref([]);

    state.tutorialWeaponTarget = ref(null);
    state.tutorialSchemeTarget = ref(null);
    state.tutorialPlansTab = ref(null);
    state.tutorialBodyCollapsed = ref(false);
    state.tutorialCollapseHighlight = ref(false);
    state.tutorialCollapseHighlightSeen = ref(false);
    state.tutorialManualAdvanceHoldIndex = ref(-1);
    state.isPortrait = ref(false);

    state.tutorialTargetWeaponName = "沧溟星梦";
    state.tutorialTargetDungeonId = "energy";
    state.tutorialTargetLockType = "s3";
    state.tutorialTargetLockValue = "附术";
    state.tutorialGuideWeaponNames = new Set(["白夜新星", "宏愿"]);
    state.tutorialRequiredBaseKeys = ["主能力提升", "敏捷提升"];

    state.formatS1 = formatS1;
  };
})();
