/// <reference types="node" />
/// <reference types="node" />
import { Schematic } from 'prismarine-schematic';
import { Vec3 } from 'vec3';
import { McStructure } from './types';
declare function parseMcStructureBuffer(buffer: Buffer, version?: string, offset?: Vec3): Promise<Schematic>;
declare function parseMcStructure(structure: McStructure, version?: string, offset?: Vec3): Promise<Schematic>;
export { McStructure, parseMcStructureBuffer, parseMcStructure };
