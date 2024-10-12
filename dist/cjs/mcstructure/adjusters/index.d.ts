import { MappingData } from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json';
import { BlockModifier, Direction } from '../blockModifier';
export type Adjuster = (target: Readonly<MappingData['pc']>, adjacents: {
    [dir in Direction]?: Readonly<MappingData['pc']>;
}) => MappingData['pc'] | null;
declare function adjustStates(modifier: BlockModifier): void;
export default adjustStates;
