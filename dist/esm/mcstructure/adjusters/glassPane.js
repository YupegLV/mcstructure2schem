import _ from 'lodash';
function isGlassPane(block) {
    return block.name.includes('glass_pane');
}
var glassPaneAdjuster = function (target, adjacents) {
    if (!isGlassPane(target))
        return null;
    var modifiedBlock = _.cloneDeep(target);
    var cardinalDirections = [
        'north',
        'south',
        'west',
        'east',
    ];
    for (var _i = 0, cardinalDirections_1 = cardinalDirections; _i < cardinalDirections_1.length; _i++) {
        var dir = cardinalDirections_1[_i];
        var adjacent = adjacents[dir];
        modifiedBlock['states'][dir] =
            adjacent && adjacent.name !== 'air' ? true : false;
    }
    return modifiedBlock;
};
export default glassPaneAdjuster;
