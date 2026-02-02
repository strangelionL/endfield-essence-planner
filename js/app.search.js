(function () {
  const modules = (window.AppModules = window.AppModules || {});

  modules.initSearch = function initSearch(ctx, state) {
    const { ref, watch } = ctx;

    const baseSortedWeapons = weapons.slice().sort((a, b) => {
      if (b.rarity !== a.rarity) return b.rarity - a.rarity;
      return compareText(a.name, b.name);
    });
    const weaponCharacterMap = new Map();
    const weaponImageSrcCache = new Map();
    const characterImageSrcCache = new Map();
    const weaponSearchIndex = ref(new Map());

      baseSortedWeapons.forEach((weapon) => {
        const chars = Array.isArray(weapon.chars) ? weapon.chars.filter(Boolean) : [];
        const uniqueChars = Array.from(new Set(chars));
        weaponCharacterMap.set(weapon.name, uniqueChars);
        weaponImageSrcCache.set(weapon.name, encodeURI(`./image/${weapon.name}.png`));
        uniqueChars.forEach((name) => {
          if (!characterImageSrcCache.has(name)) {
            characterImageSrcCache.set(name, encodeURI(`./image/characters/${name}.png`));
          }
        });
      });

    const buildWeaponSearchIndex = () => {
      const index = new Map();
      baseSortedWeapons.forEach((weapon) => {
        const characters = weaponCharacterMap.get(weapon.name) || [];
        const searchText = normalizeText(
          [
            weapon.name,
            state.tTerm("weapon", weapon.name),
            weapon.short,
            state.tTerm("short", weapon.short),
            weapon.type,
            state.tTerm("type", weapon.type),
            weapon.s1,
            state.tTerm("s1", weapon.s1),
            weapon.s2,
            state.tTerm("s2", weapon.s2),
            weapon.s3,
            state.tTerm("s3", weapon.s3),
            characters.join(" "),
            characters.map((name) => state.tTerm("character", name)).join(" "),
          ].join(" ")
        );
        index.set(weapon.name, searchText);
      });
      weaponSearchIndex.value = index;
    };

    buildWeaponSearchIndex();
    watch(state.locale, buildWeaponSearchIndex);

    state.baseSortedWeapons = baseSortedWeapons;
    state.weaponCharacterMap = weaponCharacterMap;
    state.weaponImageSrcCache = weaponImageSrcCache;
    state.characterImageSrcCache = characterImageSrcCache;
    state.weaponSearchIndex = weaponSearchIndex;
  };
})();
