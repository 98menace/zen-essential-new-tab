(() => {
  const KEY = "__essentialOpenAsNewTab";
  if (window[KEY]) return;
  window[KEY] = true;

  function getEssentialTab(event) {
    return event.composedPath().find(
      node =>
        node?.localName === "tab" &&
        node.hasAttribute("zen-essential")
    );
  }

  function isToolbarButton(event) {
    return event.composedPath().some(
      node => node?.localName === "toolbarbutton"
    );
  }

  function suppress(event) {
    if (event.button !== 0 || isToolbarButton(event)) return;

    const tab = getEssentialTab(event);
    if (!tab) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  window.addEventListener("mousedown", event => {
    if (event.button !== 0 || isToolbarButton(event)) return;

    const tab = getEssentialTab(event);
    if (!tab) return;

    const url =
      tab._zenPinnedInitialState?.entry?.url ||
      tab.linkedBrowser?.currentURI?.spec;

    if (!url || url === "about:blank") return;

    suppress(event);

    const newTab = gBrowser.addTab(url, {
      triggeringPrincipal:
        Services.scriptSecurityManager.getSystemPrincipal()
    });

    gBrowser.selectedTab = newTab;
  }, true);

  window.addEventListener("mouseup", suppress, true);
  window.addEventListener("click", suppress, true);

  console.log("[Essential Open as New Tab] Installed");
})();
