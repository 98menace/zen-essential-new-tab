
(() => {
  const KEY = "__essentialOpenAsNewTabDiagnostic";

  if (window[KEY]) return;
  window[KEY] = true;

  const showDiagnostic = () => {
    const notification = document.createElement("div");
    notification.textContent =
      "Essential New Tab: JavaScript successfully loaded!";
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "999999",
      padding: "16px 22px",
      background: "#237a45",
      color: "white",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "bold"
    });
    document.documentElement.appendChild(notification);
    setTimeout(() => notification.remove(), 8000);
  };

  showDiagnostic();

  document.addEventListener("click", event => {
    if (event.button !== 0 || event.detail !== 1) return;

    const tab = event.composedPath().find(
      el => el?.localName === "tab" &&
            el.hasAttribute?.("zen-essential")
    );

    if (!tab) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const url = tab._zenPinnedInitialState?.entry?.url ||
                tab.linkedBrowser?.currentURI?.spec;

    if (!url || url === "about:blank") return;

    const principal = Services.scriptSecurityManager
      .createContentPrincipal(Services.io.newURI(url), {});

    const newTab = gBrowser.addTab(url, {
      triggeringPrincipal: principal
    });

    gBrowser.selectedTab = newTab;
  }, true);
})();
