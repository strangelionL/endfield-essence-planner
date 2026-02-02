(function () {
  const modules = (window.AppModules = window.AppModules || {});

  modules.initMedia = function initMedia(ctx, state) {
    const hasImage = (weapon) => weaponImages.has(weapon.name);
    const weaponImageSrc = (weapon) => {
      if (!weapon) return "";
      const cached = state.weaponImageSrcCache.get(weapon.name);
      if (cached) return cached;
      const src = encodeURI(`./image/${weapon.name}.png`);
      state.weaponImageSrcCache.set(weapon.name, src);
      return src;
    };
    const weaponCharacters = (weapon) => {
      if (!weapon) return [];
      const cached = state.weaponCharacterMap.get(weapon.name);
      if (cached) return cached;
      const chars = Array.isArray(weapon.chars) ? weapon.chars.filter(Boolean) : [];
      const uniqueChars = Array.from(new Set(chars));
      state.weaponCharacterMap.set(weapon.name, uniqueChars);
      uniqueChars.forEach((name) => {
        if (!state.characterImageSrcCache.has(name)) {
          state.characterImageSrcCache.set(name, encodeURI(`./image/characters/${name}.png`));
        }
      });
      return uniqueChars;
    };
    const characterImageSrc = (name) => {
      if (!name) return "";
      const cached = state.characterImageSrcCache.get(name);
      if (cached) return cached;
      const src = encodeURI(`./image/characters/${name}.png`);
      state.characterImageSrcCache.set(name, src);
      return src;
    };
    const handleCharacterImageError = (event) => {
      const target = event && event.target;
      if (target) target.style.display = "none";
    };

    const rarityBadgeStyle = (rarity, withImage = false) => ({
      backgroundColor: withImage
        ? "rgba(255,255,255,0.04)"
        : rarity === 6
          ? "#ff7000"
          : rarity === 5
            ? "#ffba03"
            : "#9aa5b1",
      color: withImage ? "transparent" : "#0c1118",
    });

    const rarityTextStyle = (rarity) => ({
      color: rarity === 6 ? "#ff7000" : rarity === 5 ? "#ffba03" : "inherit",
    });

    state.hasImage = hasImage;
    state.weaponImageSrc = weaponImageSrc;
    state.weaponCharacters = weaponCharacters;
    state.characterImageSrc = characterImageSrc;
    state.handleCharacterImageError = handleCharacterImageError;
    state.rarityBadgeStyle = rarityBadgeStyle;
    state.rarityTextStyle = rarityTextStyle;
  };
})();
