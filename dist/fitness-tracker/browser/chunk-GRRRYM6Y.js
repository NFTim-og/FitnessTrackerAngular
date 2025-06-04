// src/app/models/exercise.model.ts
var Exercise = class _Exercise {
  constructor(data = {}) {
    this.id = "";
    this.name = "";
    this.duration = 0;
    this.calories = 0;
    this.difficulty = "medium";
    this.met_value = 4;
    this.created_by = "";
    this.created_at = (/* @__PURE__ */ new Date()).toISOString();
    this.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    this.id = data.id || "";
    this.name = data.name || "";
    this.duration = data.duration || 0;
    this.calories = data.calories || 0;
    this.difficulty = data.difficulty || "medium";
    this.met_value = data.met_value || 4;
    this.created_by = data.created_by || "";
    this.created_at = data.created_at || (/* @__PURE__ */ new Date()).toISOString();
    this.updated_at = data.updated_at || (/* @__PURE__ */ new Date()).toISOString();
  }
  static fromJSON(json) {
    return new _Exercise(json);
  }
  toJSON() {
    return {
      name: this.name,
      duration: this.duration,
      difficulty: this.difficulty,
      met_value: this.met_value
    };
  }
};

export {
  Exercise
};
//# sourceMappingURL=chunk-GRRRYM6Y.js.map
