"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCategory = exports.Stage = exports.Type = exports.Attribute = exports.Effectiveness = void 0;
var Effectiveness;
(function (Effectiveness) {
    Effectiveness["strength"] = "strength";
    Effectiveness["weakness"] = "weakness";
})(Effectiveness = exports.Effectiveness || (exports.Effectiveness = {}));
var Attribute;
(function (Attribute) {
    Attribute["data"] = "data";
    Attribute["free"] = "free";
    Attribute["vaccine"] = "vaccine";
    Attribute["virus"] = "virus";
})(Attribute = exports.Attribute || (exports.Attribute = {}));
var Type;
(function (Type) {
    Type["dark"] = "dark";
    Type["earth"] = "earth";
    Type["electric"] = "electric";
    Type["fire"] = "fire";
    Type["light"] = "light";
    Type["neutral"] = "neutral";
    Type["plant"] = "plant";
    Type["water"] = "water";
    Type["wind"] = "wind";
})(Type = exports.Type || (exports.Type = {}));
var Stage;
(function (Stage) {
    Stage["trainingLower"] = "training-lower";
    Stage["trainingUpper"] = "training-upper";
    Stage["rookie"] = "rookie";
    Stage["champion"] = "champion";
    Stage["ultimate"] = "ultimate";
    Stage["mega"] = "mega";
    Stage["ultra"] = "ultra";
    Stage["armor"] = "armor";
})(Stage = exports.Stage || (exports.Stage = {}));
var ItemCategory;
(function (ItemCategory) {
    ItemCategory["consumable"] = "consumable";
    ItemCategory["medal"] = "medal";
})(ItemCategory = exports.ItemCategory || (exports.ItemCategory = {}));
