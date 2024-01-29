import {CacheOptions, IClient} from "./types";
import {Reflektor} from "./Reflektor";

type Constructor = (new () => Object) | Function;

export class XComConfig {
	static reflektor = new Reflektor<XComConfig>();
	alias: string;
	clients: Array<{ client: IClient, version: number | Array<number> }> = [];
	authenticated: boolean = false;

	cmdConfigs: Record<string, CommandConfig> = {};

	constructor(target: Constructor) {
		this.alias = target.name;
	}

	static get(target: Constructor): XComConfig {
		let entry = this.reflektor.get(target, () => new XComConfig(target));
		return entry.value;
	};

	static set(target: Constructor, callback: (cmdSet: XComConfig) => XComConfig) {
		callback(this.get(target));
	}

	getCmd(name: string | symbol) {
		return this.cmdConfigs.hasOwnProperty(name)
			? this.cmdConfigs[name.toString()]
			: this.cmdConfigs[name.toString()] = new CommandConfig(name.toString());
	}
}

export class CommandConfig {
	alias: string;
	cache?: CacheOptions;
	clients: Array<{ client: IClient, version: number | Array<number>, cache: boolean | CacheOptions }> = [];
	authenticated?: boolean;
	preprocess?: (args: Record<string, any>) => Record<string, any>|void;
	validate?: (args: Record<string, any>) => Record<string, any>;
	description?: string;

	constructor(public func: string) {this.alias = func;}
}