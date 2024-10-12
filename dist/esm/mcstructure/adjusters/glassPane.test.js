import glassPaneAdjuster from './glassPane';
test('default', function () {
    var target = {
        name: 'glass_pane',
        states: {},
    };
    var result = glassPaneAdjuster(target, {});
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
    var result = glassPaneAdjuster(target, adjacents);
    expect(result === null || result === void 0 ? void 0 : result.states).toEqual({
        north: true,
        south: true,
        west: true,
        east: false,
    });
});
