"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var glassPane_1 = __importDefault(require("./glassPane"));
test('default', function () {
    var target = {
        name: 'glass_pane',
        states: {},
    };
    var result = (0, glassPane_1.default)(target, {});
    expect(result === null || result === void 0 ? void 0 : result.states).toEqual({
        north: false,
        south: false,
        west: false,
        east: false,
    });
});
test('adjacent', function () {
    var target = {
        name: 'glass_pane',
        states: {},
    };
    var adjacents = {
        north: {
            name: 'glass_pane',
            states: {},
        },
        south: {
            name: 'glass_pane',
            states: {},
        },
        west: {
            name: 'glass_pane',
            states: {},
        },
        east: {
            name: 'air',
            states: {},
        },
    };
    var result = (0, glassPane_1.default)(target, adjacents);
    expect(result === null || result === void 0 ? void 0 : result.states).toEqual({
        north: true,
        south: true,
        west: true,
        east: false,
    });
});
