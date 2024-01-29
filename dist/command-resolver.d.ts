/// <reference types="node" />
import { Request, Response } from "express";
import { CommandHandler } from "./command-handler";
import { RequestParser } from "./request-parser";
import { EventEmitter } from "events";
type TResolvers = Record<string, // client
Record<number, // version
Record<string, // command
CommandHandler>>>;
type CacheReaderFunc = (handler: () => any, key: string, ttl: number) => Promise<any>;
type CommandResolverOptions = {
    requestParser: RequestParser;
    cacheReader: CacheReaderFunc | undefined;
    eventEmitter: EventEmitter;
};
export declare class CommandResolver {
    private commandSets;
    readonly resolvers: TResolvers;
    readonly requestParser: RequestParser;
    readonly cacheReader: CacheReaderFunc | undefined;
    readonly eventEmitter: EventEmitter | undefined;
    constructor(commandSets: Array<typeof Object>, options?: Partial<CommandResolverOptions>);
    protected parse(): void;
    protected addCmd(cmd: CommandHandler): void;
    handle(client: string, version: number, command: string, req: Request, res: Response): Promise<void>;
}
export {};
