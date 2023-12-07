import { CacheOptions, CommandFunc, IClient } from "./types";
import { Request, Response } from "express";
import { CommandResolver } from "./command-resolver";
export declare class CommandHandler {
    readonly handler: CommandFunc;
    readonly authenticated: boolean;
    readonly cacheOptions: undefined | CacheOptions;
    readonly preprocess: undefined | ((args: Record<string, any>) => Record<string, any> | void);
    readonly validate: undefined | ((args: Record<string, any>) => Record<string, any>);
    readonly client: IClient;
    readonly version: number;
    readonly command: string;
    readonly commandResolver: CommandResolver;
    readonly target: {
        "class": string;
        func: string;
    };
    readonly description?: string | undefined;
    constructor(handler: CommandFunc, authenticated: boolean, cacheOptions: undefined | CacheOptions, preprocess: undefined | ((args: Record<string, any>) => Record<string, any> | void), validate: undefined | ((args: Record<string, any>) => Record<string, any>), client: IClient, version: number, command: string, commandResolver: CommandResolver, target: {
        "class": string;
        func: string;
    }, description?: string | undefined);
    toJSON(): {
        authenticated: boolean;
        cache: number | undefined;
        description: string | undefined;
        class: string;
        func: string;
    };
    handle(req: Request, res: Response): Promise<any>;
    protected getCacheKey(args: Record<string, any>, authenticated?: string): string;
    protected checkApiAccess(req: Request): void;
    protected getAuthenticated(req: Request): string | undefined;
}
