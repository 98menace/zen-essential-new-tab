
(() => {
  const TAG = "[Essential Open as New Tab]";

  if (window.__essentialOpenAsNewTab) return;
  window.__essentialOpenAsNewTab = true;

  const container = gBrowser.tabContainer;

  container.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.detail !== 1
    ) return;

    const tab = event.target.closest("tab.tabbrowser-tab");

    if (!tab || !tab.hasAttribute("zen-essential")) return;

    if (event.target.closest("toolbarbutton")) return;

    const browser = tab.linkedBrowser;
    const url = browser?.currentURI?.spec;

    if (!url || url === "about:blank") return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const newTab = gBrowser.addTab(url, {
      triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
    });

    gBrowser.selectedTab = newTab;
  }, true);

  console.log(TAG, "Installed");
})();
