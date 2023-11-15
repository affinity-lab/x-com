/// <reference types="node" />
import { Buffer } from "buffer";
export default class FileField {
    readonly name: string;
    readonly mimetype: string;
    readonly size: number;
    readonly buffer: Buffer;
    constructor(name: string, mimetype: string, size: number, buffer: Buffer);
    save(to: string): void;
}
