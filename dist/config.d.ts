import { CacheOptions, IClient } from "./types";
type Constructor = (new () => Object) | Function;
export declare class XComConfig {
    target: Constructor;
    alias: string;
    clients: Array<{
        client: IClient;
        version: number | Array<number>;
    }>;
    authenticated: boolean;
    cmdConfigs: Record<string, CommandConfig>;
    constructor(target: Constructor);
    private static get;
    static set(target: Constructor, callback: (cmdSet: XComConfig) => XComConfig): void;
    getCmd(name: string | symbol): CommandConfig;
    static getConfigsFromCommandSets(commands: {}[]): any[];
}
export declare class CommandConfig {
    func: string;
    alias: string;
    cache?: CacheOptions;
    clients: Array<{
        client: IClient;
        version: number | Array<number>;
        cache: boolean | CacheOptions;
    }>;
    authenticated?: boolean;
    preprocess?: (args: Record<string, any>) => Record<string, any> | void;
    validate?: (args: Record<string, any>) => Record<string, any>;
    description?: string;
    constructor(func: string);
}
export {};
