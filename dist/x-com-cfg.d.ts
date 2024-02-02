import { CommandHandler } from "./command-handler";
import { ClassMetaData } from "./util/class-meta-data";
import { CommandResolver } from "./command-resolver";
type Constructor = (new () => Object) | Function;
declare class XComCfg {
    readonly metadataStore: ClassMetaData;
    parseXComMeta(target: Constructor, commandResolver: CommandResolver): CommandHandler[];
}
export declare let xcomCfg: XComCfg;
export {};
