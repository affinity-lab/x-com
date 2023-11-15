import { CacheOptions, IClient } from "../../types";
export declare const CommandClient: (client: IClient, version?: number | Array<number>, cache?: boolean | CacheOptions) => MethodDecorator;
