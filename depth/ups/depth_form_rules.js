DEPTH.Form.SHOW_PARENT_PROJECT_TIER_VALUES = [545630000];

DEPTH.Form.TIER_II_VALUES = [545630001];

DEPTH.Form.applyTierSectionRule = function() {
    if (this.tierValue == null || this.TIER_II_VALUES.includes(this.tierValue)) {
        // Hide general_childprojects section
        this.general_childprojects.hidden = true;
    } else {
        this.general_childprojects.hidden = false;
    }
};

DEPTH.Form.applyParentProjectVisibilityRule = function() {
    if (this.SHOW_PARENT_PROJECT_TIER_VALUES.includes(this.tierValue)) {
        this.depth_parentproject.hidden = false;
    } else {
        this.depth_parentproject.hidden = true;
    }
};