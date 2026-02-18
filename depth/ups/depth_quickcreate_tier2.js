// depth_quickcreate_tier2.js
// Script for Quick Create Tier II form - Auto-populate Tier Number
var DEPTH = window.DEPTH || {};
DEPTH.QuickCreateTier2 = DEPTH.QuickCreateTier2 || {};

(function () {
  "use strict";

  // =========================
  // CONFIG
  // =========================

  // Tier Number field attribute schema name
  DEPTH.QuickCreateTier2.TIER_FIELD = "depth_tiernumber";

  // Tier II value to auto-populate (545630001)
  DEPTH.QuickCreateTier2.TIER_II_VALUE = 545630001;

  // =========================
  // ONLOAD HANDLER
  // =========================

  /**
   * OnLoad handler for Quick Create Tier II form
   * Automatically populates the Tier Number field with Tier II value
   * @param {Object} executionContext - The execution context provided by the form
   */
  DEPTH.QuickCreateTier2.onload = function (executionContext) {
    try {
      var formContext = executionContext.getFormContext();
      if (!formContext) return;

      // Get the Tier Number attribute
      var tierAttr = formContext.getAttribute(DEPTH.QuickCreateTier2.TIER_FIELD);
      if (!tierAttr) return;

      // Set the value to Tier II (545630001) if not already set
      var currentValue = tierAttr.getValue();
      if (currentValue === null || currentValue === undefined) {
        tierAttr.setValue(DEPTH.QuickCreateTier2.TIER_II_VALUE);
      }
    } catch (e) {
      // Silently fail to avoid disrupting form load
      console.error("DEPTH.QuickCreateTier2.onload error:", e);
    }
  };

})();
