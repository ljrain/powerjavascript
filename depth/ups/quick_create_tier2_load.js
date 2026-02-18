// quick_create_tier2_load.js
// Logic for quick create form: Set Tier Number to Tier II (545630001) and make it read-only
var DEPTH = window.DEPTH || {};
DEPTH.QuickCreate = DEPTH.QuickCreate || {};

(function () {
  "use strict";

  // =========================
  // CONFIG
  // =========================

  // Tier field attribute schema name
  DEPTH.QuickCreate.TIER_FIELD = "depth_tiernumber";
  
  // Default tier value for quick create: Tier II
  DEPTH.QuickCreate.DEFAULT_TIER_VALUE = 545630001; // Tier II

  // =========================
  // HELPERS
  // =========================

  // Disable/enable ALL controls bound to an attribute (handles header/body duplicates)
  DEPTH.QuickCreate.setAttributeDisabled = function (formContext, attributeName, disabled) {
    try {
      if (!formContext || !attributeName) return;
      var attr = formContext.getAttribute(attributeName);
      if (!attr) return;

      // Each attribute can have multiple controls on the form (header/body/etc.)
      attr.controls.forEach(function (ctrl) {
        try {
          if (ctrl && typeof ctrl.setDisabled === "function") {
            ctrl.setDisabled(disabled);
          }
        } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }
  };

  // =========================
  // BUSINESS RULES
  // =========================

  // Set Tier Number to Tier II and make it read-only on quick create form
  DEPTH.QuickCreate.setDefaultTierAndLock = function (formContext) {
    try {
      var tierAttr = formContext.getAttribute(DEPTH.QuickCreate.TIER_FIELD);
      if (!tierAttr) return;

      // Set the default value to Tier II (545630001)
      var currentValue = tierAttr.getValue();
      if (currentValue === null || currentValue === undefined) {
        tierAttr.setValue(DEPTH.QuickCreate.DEFAULT_TIER_VALUE);
      }

      // Make the field read-only
      DEPTH.QuickCreate.setAttributeDisabled(formContext, DEPTH.QuickCreate.TIER_FIELD, true);
    } catch (e) { /* ignore */ }
  };

  // =========================
  // EVENT WIRING
  // =========================

  DEPTH.QuickCreate.onload = function (executionContext) {
    var formContext = executionContext.getFormContext();

    // Apply default tier value and lock the field
    DEPTH.QuickCreate.setDefaultTierAndLock(formContext);
  };

})();
