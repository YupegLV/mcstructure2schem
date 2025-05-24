import { Vec3 } from 'vec3';
import { BlockInfo } from './types';
type CardinalDirection = 'north' | 'south' | 'west' | 'east';
type Direction = CardinalDirection | 'up' | 'down';
type MappingData = {
    pc: {
        name: string;
        states: {
            [key: string]: string | number | boolean;
        };
    };
    pe: {
        name: string;
        states: {
            [key: string]: string | number | boolean;
        };
    };
};
declare class BlockModifier {
    palette: Readonly<MappingData['pc']>[];
    indices: number[];
    size: Vec3;
    constructor(palette: Readonly<MappingData['pc']>[], indices: number[], size: Vec3);
    static fromMcStructure(palette: BlockInfo[], indices: number[], size: Vec3): Promise<BlockModifier>;
    getBlock(x: number, y: number, z: number): Readonly<{
        name: string;
        states: {
            [key: string]: string | number | boolean;
        };
    }>;
    setBlock(x: number, y: number, z: number, block: MappingData['pc']): void;
    getAdjacentBlocks(x: number, y: number, z: number): {
        north?: {
            name: string;
            states: {
                [key: string]: string | number | boolean;
            };
        } | undefined;
        south?: {
            name: string;
            states: {
                [key: string]: string | number | boolean;
            };
        } | undefined;
        west?: {
            name: string;
            states: {
                [key: string]: string | number | boolean;
            };
        } | undefined;
        east?: {
            name: string;
            states: {
                [key: string]: string | number | boolean;
            };
        } | undefined;
        up?: {
            name: string;
            states: {
                [key: string]: string | number | boolean;
            };
        } | undefined;
        down?: {
            name: string;
            states: {
                [key: string]: string | number | boolean;
            };
        } | undefined;
    };
    static getRelativeDirectionMappings(facing: CardinalDirection): {
        front: CardinalDirection;
        back: CardinalDirection;
        left: CardinalDirection;
        right: CardinalDirection;
    };
    generateStateIdPalette(version: string): number[];
}
export { BlockModifier, CardinalDirection, Direction };
