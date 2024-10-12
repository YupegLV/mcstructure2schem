import stairAdjuster from './stair';
import glassPaneAdjuster from './glassPane';
var adjusters = [stairAdjuster, glassPaneAdjuster];
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
export default adjustStates;
