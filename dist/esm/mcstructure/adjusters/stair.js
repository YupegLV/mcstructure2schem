import { BlockModifier } from '../blockModifier';
import _ from 'lodash';
function isStair(block) {
    return block.name.includes('stairs');
}
var stairAdjuster = function (target, adjacents) {
    if (!isStair(target))
        return null;
    var facing = target.states.facing;
    var relativeDirectionMappings = BlockModifier.getRelativeDirectionMappings(facing);
    var straightAdjacents = Object.values(_.pick(adjacents, [
        relativeDirectionMappings.left,
        relativeDirectionMappings.right,
    ]));
    if (straightAdjacents.length === 2 &&
        straightAdjacents.every(function (adjacent) {
            return isStair(adjacent) &&
                adjacent.states.half === target.states.half &&
                adjacent.states.facing === target.states.facing;
        })) {
        var modifiedBlock_1 = _.cloneDeep(target);
        modifiedBlock_1.states.shape = 'straight';
        return modifiedBlock_1;
    }
    var outerAdjacent = adjacents[relativeDirectionMappings['front']];
    if (outerAdjacent &&
        isStair(outerAdjacent) &&
        outerAdjacent.states.half === target.states.half) {
        if (outerAdjacent.states.facing === relativeDirectionMappings['left']) {
            var modifiedBlock_2 = _.cloneDeep(target);
            modifiedBlock_2.states.shape = 'outer_left';
            return modifiedBlock_2;
        }
        if (outerAdjacent.states.facing === relativeDirectionMappings['right']) {
            var modifiedBlock_3 = _.cloneDeep(target);
            modifiedBlock_3.states.shape = 'outer_right';
            return modifiedBlock_3;
        }
    }
    var innerAdjacent = adjacents[relativeDirectionMappings['back']];
    if (innerAdjacent &&
        isStair(innerAdjacent) &&
        innerAdjacent.states.half === target.states.half) {
        if (innerAdjacent.states.facing === relativeDirectionMappings['left']) {
            var modifiedBlock_4 = _.cloneDeep(target);
            modifiedBlock_4.states.shape = 'inner_left';
            return modifiedBlock_4;
        }
        if (innerAdjacent.states.facing === relativeDirectionMappings['right']) {
            var modifiedBlock_5 = _.cloneDeep(target);
            modifiedBlock_5.states.shape = 'inner_right';
            return modifiedBlock_5;
        }
    }
    var modifiedBlock = _.cloneDeep(target);
    modifiedBlock.states.shape = 'straight';
    return modifiedBlock;
};
export default stairAdjuster;
