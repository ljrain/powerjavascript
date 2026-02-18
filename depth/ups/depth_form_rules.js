// depth_form_rules.js  (DROP-IN REPLACEMENT)
var DEPTH = window.DEPTH || {};
DEPTH.Form = DEPTH.Form || {};
 
(function () {
  "use strict";
 
  // =========================
  // CONFIG (UPDATE THESE)
  // =========================
 
  // Attribute schema names to lock AFTER first save (Update).
  // IMPORTANT: These must be ATTRIBUTE (column) schema names, not display labels.
  DEPTH.Form.FIELDS_TO_LOCK = [
    "depth_tiernumber",
    "depth_owningdepartment",
    "depth_technicalpoc",
    "depth_parentproject",
    "ownerid",
    "statecode",
    "statuscode"
  ];
 
  // Project Name label as it appears on the form (used to discover the real attribute schema name)
  DEPTH.Form.PROJECT_NAME_LABEL = "Project Name";
 
  // Tier field attribute schema name
  DEPTH.Form.TIER_FIELD = "depth_tiernumber";
 
  // Section hide rule (use TAB/SECTION *Name* properties from form designer, not the label text)
  DEPTH.Form.TARGET_TAB = "general";
  DEPTH.Form.TARGET_SECTION = "general_childprojects";
  DEPTH.Form.SHOW_SECTION_WHEN_TIER_VALUE = 545630001; // Tier II numeric value
 
  // Parent Project visibility rule
  // Field control/attribute schema name for Parent Project lookup
  DEPTH.Form.PARENT_PROJECT_FIELD = "depth_parentproject";

  // Show Parent Project when Tier indicates "Tier II"
  // - Numeric match is best when Tier is a Whole Number or Choice returning a numeric value.
  DEPTH.Form.SHOW_PARENT_PROJECT_TIER_VALUES = [545630001]; // Tier II

  // - Label match is best when Tier is a Choice/OptionSet and you prefer comparing text.
  DEPTH.Form.SHOW_PARENT_PROJECT_TIER_LABELS = ["Tier II", "Tier 2"];
 
  // Optional: clear Parent Project when hidden
  DEPTH.Form.CLEAR_PARENT_PROJECT_WHEN_HIDDEN = false;
 
  // =========================
  // HELPERS
  // =========================
 
  // Disable/enabled ALL controls bound to an attribute (handles header/body duplicates)
  DEPTH.Form.setAttributeDisabled = function (formContext, attributeName, disabled) {
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
 
  // Disable list of names - tries attribute first, then direct control lookup (for non-field controls)
  DEPTH.Form.setControlsDisabled = function (formContext, names, disabled) {
    try {
      if (!formContext || !Array.isArray(names)) return;
 
      names.forEach(function (name) {
        // Attribute route (best for fields)
        DEPTH.Form.setAttributeDisabled(formContext, name, disabled);
 
        // Control route (useful for subgrids/web resources by control name)
        try {
          var ctrl = formContext.getControl(name);
          if (ctrl && typeof ctrl.setDisabled === "function") {
            ctrl.setDisabled(disabled);
          }
        } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }
  };
 
  // Set section visibility safely
  DEPTH.Form.setSectionVisible = function (formContext, tabName, sectionName, visible) {
    try {
      if (!formContext) return;
      var tab = formContext.ui.tabs.get(tabName);
      if (!tab) return;
 
      var section = tab.sections.get(sectionName);
      if (!section) return;
 
      section.setVisible(visible);
    } catch (e) { /* ignore */ }
  };
 
  // Set control visibility safely
  DEPTH.Form.setControlVisible = function (formContext, controlOrAttributeName, visible) {
    try {
      if (!formContext || !controlOrAttributeName) return;
 
      // Prefer control
      var ctrl = null;
      try { ctrl = formContext.getControl(controlOrAttributeName); } catch (e) { /* ignore */ }
 
      if (ctrl && typeof ctrl.setVisible === "function") {
        ctrl.setVisible(visible);
        return;
      }
 
      // Fallback: attribute -> first control
      var attr = null;
      try { attr = formContext.getAttribute(controlOrAttributeName); } catch (e) { /* ignore */ }
      if (attr && attr.controls && attr.controls.getLength && attr.controls.getLength() > 0) {
        var firstCtrl = attr.controls.get(0);
        if (firstCtrl && typeof firstCtrl.setVisible === "function") {
          firstCtrl.setVisible(visible);
        }
      }
    } catch (e) { /* ignore */ }
  };
 
  // Get Tier label safely (Choice/OptionSet)
  DEPTH.Form.getTierLabel = function (formContext) {
    try {
      var attr = formContext.getAttribute(DEPTH.Form.TIER_FIELD);
      if (!attr) return null;
 
      // Choice/OptionSet: getSelectedOption().text
      if (typeof attr.getSelectedOption === "function") {
        var opt = attr.getSelectedOption();
        if (opt && opt.text) return opt.text;
      }
 
      // Many attribute types support getText()
      if (typeof attr.getText === "function") {
        var t = attr.getText();
        if (t) return t;
      }
 
      // Fallback
      var v = attr.getValue();
      return (v === null || v === undefined) ? null : String(v);
    } catch (e) {
      return null;
    }
  };
 
  // Get Tier numeric value (Whole Number / Choice underlying value)
  DEPTH.Form.getTierValue = function (formContext) {
    try {
      var attr = formContext.getAttribute(DEPTH.Form.TIER_FIELD);
      if (!attr) return null;
      return attr.getValue();
    } catch (e) {
      return null;
    }
  };
 
  // Find the attribute schema name by matching a control label on the form (for Project Name)
  DEPTH.Form.findAttributeNameByLabel = function (formContext, labelToFind) {
    try {
      if (!formContext || !labelToFind) return null;
 
      var wanted = String(labelToFind).trim().toLowerCase();
      var found = null;
 
      formContext.data.entity.attributes.forEach(function (attr) {
        if (found) return;
        try {
          attr.controls.forEach(function (ctrl) {
            if (found) return;
            try {
              var lbl = ctrl.getLabel();
              if (lbl && String(lbl).trim().toLowerCase() === wanted) {
                found = attr.getName();
              }
            } catch (e) { /* ignore */ }
          });
        } catch (e) { /* ignore */ }
      });
 
      return found;
    } catch (e) {
      return null;
    }
  };
 
  // =========================
  // BUSINESS RULES
  // =========================
 
  // Rule 1: Create = editable; Update (after first save) = read-only
  DEPTH.Form.applyCreateVsUpdateRule = function (formContext) {
    try {
      var formType = formContext.ui.getFormType();   // 1 = Create, 2 = Update
      var isCreate = (formType === 1);
 
      // Lock configured fields after save/update
      DEPTH.Form.setControlsDisabled(formContext, DEPTH.Form.FIELDS_TO_LOCK, !isCreate);
 
      // Lock Project Name after save/update by discovering the real attribute schema name
      if (!isCreate) {
        var projAttrName = DEPTH.Form.findAttributeNameByLabel(formContext, DEPTH.Form.PROJECT_NAME_LABEL);
        // console.log("DEPTH: Project Name attribute found:", projAttrName);
        if (projAttrName) {
          DEPTH.Form.setAttributeDisabled(formContext, projAttrName, true);
        }
      }
    } catch (e) { /* ignore */ }
  };
 
  // Rule 2: Show ChildProjects section only when Tier = Tier II (545630001)
  DEPTH.Form.applyTierSectionRule = function (formContext) {
    try {
      var tierValue = DEPTH.Form.getTierValue(formContext);
      var show = false;

      // Show section only when Tier is set to Tier II (545630001)
      if (tierValue !== null && tierValue !== undefined && tierValue === DEPTH.Form.SHOW_SECTION_WHEN_TIER_VALUE) {
        show = true;
      }

      // Show/hide the whole section
      DEPTH.Form.setSectionVisible(
        formContext,
        DEPTH.Form.TARGET_TAB,
        DEPTH.Form.TARGET_SECTION,
        show
      );
    } catch (e) { /* ignore */ }
  };
 
  // Rule 3: Parent Project visible ONLY when Tier indicates Tier II (545630001)
  DEPTH.Form.applyParentProjectVisibilityRule = function (formContext) {
    try {
      var tierValue = DEPTH.Form.getTierValue(formContext);
      var tierLabel = DEPTH.Form.getTierLabel(formContext);
 
      var show = false;
 
      // Numeric match (preferred)
      if (tierValue !== null && tierValue !== undefined) {
        if (DEPTH.Form.SHOW_PARENT_PROJECT_TIER_VALUES.indexOf(tierValue) >= 0) {
          show = true;
        }
      }
 
      // Label match (fallback)
      if (!show && tierLabel) {
        var normalized = String(tierLabel).trim();
        if (DEPTH.Form.SHOW_PARENT_PROJECT_TIER_LABELS.indexOf(normalized) >= 0) {
          show = true;
        }
      }
 
      // Apply visibility
      DEPTH.Form.setControlVisible(formContext, DEPTH.Form.PARENT_PROJECT_FIELD, show);
 
      // Optionally clear value when hidden
      if (!show && DEPTH.Form.CLEAR_PARENT_PROJECT_WHEN_HIDDEN) {
        try {
          var attr = formContext.getAttribute(DEPTH.Form.PARENT_PROJECT_FIELD);
          if (attr) attr.setValue(null);
        } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
  };
 
  // =========================
  // EVENT WIRING
  // =========================
 
  DEPTH.Form.onload = function (executionContext) {
    var formContext = executionContext.getFormContext();
 
    // Run rules on load
    DEPTH.Form.applyCreateVsUpdateRule(formContext);
    DEPTH.Form.applyTierSectionRule(formContext);
    DEPTH.Form.applyParentProjectVisibilityRule(formContext);
 
    // Re-run tier-driven rules on Tier change
    try {
      var tierAttr = formContext.getAttribute(DEPTH.Form.TIER_FIELD);
      if (tierAttr && typeof tierAttr.addOnChange === "function") {
        tierAttr.addOnChange(function () {
          DEPTH.Form.applyTierSectionRule(formContext);
          DEPTH.Form.applyParentProjectVisibilityRule(formContext);
        });
      }
    } catch (e) { /* ignore */ }
 
    // Re-run after save (locks immediately after create save)
    try {
      formContext.data.entity.addOnPostSave(function () {
        DEPTH.Form.applyCreateVsUpdateRule(formContext);
        DEPTH.Form.applyTierSectionRule(formContext);
        DEPTH.Form.applyParentProjectVisibilityRule(formContext);
      });
    } catch (e) { /* ignore */ }
  };
 
})();
 
