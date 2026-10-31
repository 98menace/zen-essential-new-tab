
(() => {
  const KEY = "__essentialOpenAsNewTabV2";

  if (window[KEY]) return;
  window[KEY] = true;

  console.log("[Essential New Tab] Mod loaded");

  document.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.detail !== 1 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const path = event.composedPath();

    const tab = path.find(
      element =>
        element?.localName === "tab" &&
        element.hasAttribute?.("zen-essential")
    );

    if (!tab) return;

    // Ignore tab controls, not clicks on the tab itself.
    if (path.some(element =>
      element?.classList?.contains("tab-close-button") ||
      element?.classList?.contains("zen-tab-reset-button")
    )) return;

    const url =
      tab._zenPinnedInitialState?.entry?.url ||
      tab.linkedBrowser?.currentURI?.spec;

    if (!url || url === "about:blank") return;

    // Stop Zen from selecting the original Essential.
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const uri = Services.io.newURI(url);
    const principal =
      Services.scriptSecurityManager.createContentPrincipal(uri, {});

    const newTab = gBrowser.addTab(url, {
      triggeringPrincipal: principal,
      inBackground: false
    });

    gBrowser.selectedTab = newTab;

    console.log("[Essential New Tab] Opened:", url);

  }, true);
})();
