var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import nbt from 'prismarine-nbt';
import { Schematic } from 'prismarine-schematic';
import { Vec3 } from 'vec3';
import { BlockModifier } from './blockModifier';
import adjustStates from './adjusters';
function parseMcStructureBuffer(buffer, version, offset) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = parseMcStructure;
                    _c = (_b = nbt).simplify;
                    return [4 /*yield*/, nbt.parse(buffer)];
                case 1: return [4 /*yield*/, _c.apply(_b, [(_d.sent()).parsed])];
                case 2: return [2 /*return*/, _a.apply(void 0, [_d.sent(), version,
                        offset])];
            }
        });
    });
}
function parseMcStructure(structure, version, offset) {
    if (offset === void 0) { offset = new Vec3(0, 0, 0); }
    return __awaiter(this, void 0, void 0, function () {
        var size, modifier;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!version) {
                        version = verNum2majorVer(structure.structure.palette.default.block_palette[0].version);
                    }
                    size = new Vec3(structure.size[0], structure.size[1], structure.size[2]);
                    return [4 /*yield*/, BlockModifier.fromMcStructure(structure.structure.palette.default.block_palette, structure.structure.block_indices[0], size)];
                case 1:
                    modifier = _a.sent();
                    adjustStates(modifier);
                    return [2 /*return*/, new Schematic(version, size, offset, modifier.generateStateIdPalette(version), modifier.indices)];
            }
        });
    });
}
function verNum2majorVer(version) {
    var versionArray = [];
    for (var i = 0; i < 4; i++) {
        var shiftedVersion = version >> (8 * i);
        versionArray[i] = shiftedVersion & 0xff;
    }
    return versionArray.reverse().slice(0, 2).join('.');
}
export { parseMcStructureBuffer, parseMcStructure };
