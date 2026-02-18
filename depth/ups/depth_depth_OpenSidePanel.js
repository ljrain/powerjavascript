var DEPTH = window.DEPTH || {};
DEPTH.UPSChange = DEPTH.UPSChange || {};
 
(function () {
  "use strict";
 
  // === CONFIG ===
  const PANE_ID = "depth_UPSChangeRequestPane";
  const PANE_TITLE = "Change Request";
  const PANE_WIDTH = 420;
 
  // Custom Page logical name (what you said you have)
  const CUSTOM_PAGE_NAME = "depth_changerequestpage_95533";
 
  // Parent table logical name (your table)
  const PARENT_ENTITY_LOGICAL = "depth_ups"; // logical name is typically lowercase
 
  // === Helpers ===
  function normalizeGuid(id) {
    if (!id) return null;
    // handle cases where platform gives "{GUID}" or just "GUID"
    return String(id).replace(/[{}]/g, "");
  }
 
  async function getOrCreatePane() {
    let pane = Xrm.App.sidePanes.getPane(PANE_ID);
    if (pane) return pane;
 
    // Side panes API: createPane + navigate
    pane = await Xrm.App.sidePanes.createPane({
      title: PANE_TITLE,
      paneId: PANE_ID,
      width: PANE_WIDTH,
      canClose: true
    });
    return pane;
  }
 
  // === ENTRYPOINT for your command bar button ===
  // Parameter 1 in your screenshot: FirstPrimaryItemId
  DEPTH.UPSChange.openNameChangePanel = async function (firstPrimaryItemId) {
    try {
      const recordId = normalizeGuid(firstPrimaryItemId);
 
      const pane = await getOrCreatePane();
      pane.badge = 1;
 
      // Navigate to Custom Page in the side pane using record context.
      // Custom page will read Param("recordId") and Param("entityName").
      await pane.navigate({
        pageType: "custom",
        name: CUSTOM_PAGE_NAME,
        entityName: PARENT_ENTITY_LOGICAL,
        recordId: recordId
      });
 
    } catch (e) {
      console.error("openNameChangePanel failed", e);
      Xrm.Navigation.openAlertDialog({
        title: "Change Request",
        text: "Failed to open the Change Request panel. Check console for details."
      });
    }
  };
 
  // OPTIONAL: If your command designer expects a global function name
  // instead of namespaced, uncomment the next line and set the function name to openNameChangePanel
  // window.openNameChangePanel = depth.DepthChange.openNameChangePanel;
 
})();
