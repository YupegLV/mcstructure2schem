"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockModifier = void 0;
var lodash_1 = __importDefault(require("lodash"));
var minecraft_data_1 = __importDefault(require("minecraft-data"));
var states_1 = require("prismarine-schematic/lib/states");
var dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
var blockMappings = [];
function fetchBlockMappings() {
    return __awaiter(this, void 0, void 0, function () {
        var bmjson, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bmjson = 'http://127.0.0.1:3000/config/blockMappings.json';
                    if (process.env.NODE_ENV === 'production') {
                        bmjson = 'https://arch.mc.icu/api/config/blockMappings.json';
                    }
                    return [4 /*yield*/, fetch(bmjson)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    blockMappings = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var BlockModifier = /** @class */ (function () {
    function BlockModifier(palette, indices, size) {
        this.palette = palette;
        this.indices = indices;
        this.size = size;
    }
    BlockModifier.fromMcStructure = function (palette, indices, size) {
        return __awaiter(this, void 0, void 0, function () {
            var javaPalette, javaIndices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchBlockMappings()];
                    case 1:
                        _a.sent();
                        javaPalette = palette
                            .map(function (_a) {
                            var name = _a.name, others = __rest(_a, ["name"]);
                            return (__assign({ name: name.replace('minecraft:', '') }, others));
                        })
                            .map(bedrock2java);
                        javaIndices = zyx2xzy(indices, size);
                        return [2 /*return*/, new BlockModifier(javaPalette, javaIndices, size)];
                }
            });
        });
    };
    BlockModifier.prototype.getBlock = function (x, y, z) {
        var index = this.indices[x + z * this.size.x + y * this.size.x * this.size.z];
        return this.palette[index];
    };
    BlockModifier.prototype.setBlock = function (x, y, z, block) {
        var indexId = this.palette.findIndex(function (data) { return lodash_1.default.isEqual(data, block); });
        if (indexId === -1) {
            indexId = this.palette.push(block) - 1;
        }
        this.indices[x + z * this.size.x + y * this.size.x * this.size.z] = indexId;
    };
    BlockModifier.prototype.getAdjacentBlocks = function (x, y, z) {
        var blocks = {};
        if (x + 1 < this.size.x)
            blocks['east'] = this.getBlock(x + 1, y, z);
        if (0 <= x - 1)
            blocks['west'] = this.getBlock(x - 1, y, z);
        if (y + 1 < this.size.y)
            blocks['up'] = this.getBlock(x, y + 1, z);
        if (0 <= y - 1)
            blocks['down'] = this.getBlock(x, y - 1, z);
        if (z + 1 < this.size.z)
            blocks['south'] = this.getBlock(x, y, z + 1);
        if (0 <= z - 1)
            blocks['north'] = this.getBlock(x, y, z - 1);
        return blocks;
    };
    BlockModifier.getRelativeDirectionMappings = function (facing) {
        switch (facing) {
            case 'north':
                return { front: 'north', back: 'south', left: 'west', right: 'east' };
            case 'south':
                return { front: 'south', back: 'north', left: 'east', right: 'west' };
            case 'west':
                return { front: 'west', back: 'east', left: 'south', right: 'north' };
            case 'east':
                return { front: 'east', back: 'west', left: 'north', right: 'south' };
        }
    };
    BlockModifier.prototype.generateStateIdPalette = function (version) {
        var javaMcData = (0, minecraft_data_1.default)(version);
        return this.palette.map(function (block) {
            var stringizedStates = lodash_1.default.mapValues(block.states, lodash_1.default.toString);
            return (0, states_1.getStateId)(javaMcData, block.name, Object.entries(stringizedStates));
        });
    };
    return BlockModifier;
}());
exports.BlockModifier = BlockModifier;
function bedrock2java(bedrock) {
    var _a;
    var javaBlock = (_a = blockMappings.find(function (mapping) {
        return mapping.pe.name === bedrock.name &&
            Object.entries(mapping.pe.states).every(function (_a) {
                var search_key = _a[0], search_value = _a[1];
                return bedrock.states[search_key] == search_value;
            });
    })) === null || _a === void 0 ? void 0 : _a.pc;
    if (!javaBlock) {
        console.warn("Unknown block ".concat(bedrock.name, "[").concat(Object.entries(bedrock.states)
            .map(function (state) { return state.join('='); })
            .join(','), "] replacing with air"));
        javaBlock = blockMappings[0].pc;
    }
    return javaBlock;
}
function zyx2xzy(src, size) {
    var out = [];
    for (var x = 0; x < size.x; x++) {
        for (var y = 0; y < size.y; y++) {
            for (var z = 0; z < size.z; z++) {
                out[x + z * size.x + y * size.x * size.z] =
                    src[z + y * size.z + x * size.z * size.y];
            }
        }
    }
    return out;
}
