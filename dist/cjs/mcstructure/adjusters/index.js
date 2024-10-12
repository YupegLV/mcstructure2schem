"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var stair_1 = __importDefault(require("./stair"));
var glassPane_1 = __importDefault(require("./glassPane"));
var adjusters = [stair_1.default, glassPane_1.default];
function adjustStates(modifier) {
    for (var x = 0; x < modifier.size.x; x++) {
        for (var y = 0; y < modifier.size.y; y++) {
            for (var z = 0; z < modifier.size.z; z++) {
                var target = modifier.getBlock(x, y, z);
                var adjucents = modifier.getAdjacentBlocks(x, y, z);
                for (var _i = 0, adjusters_1 = adjusters; _i < adjusters_1.length; _i++) {
                    var adjuster = adjusters_1[_i];
                    var modified = adjuster(target, adjucents);
                    if (modified)
                        modifier.setBlock(x, y, z, modified);
                }
            }
        }
    }
}
exports.default = adjustStates;
