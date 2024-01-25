import {CacheOptions, IClient} from "./types";

type Constructor = (new () => Object) | Function;

export class XComConfig {
	alias: string;
	clients: Array<{ client: IClient, version: number | Array<number> }> = [];
	authenticated: boolean = false;

	cmdConfigs: Record<string, CommandConfig> = {};

	constructor(public target: Constructor) {
		this.alias = target.name;
	}

	private static get(target: Constructor): XComConfig {
		if (Reflect.has(target, "cmd-set")) {
			let t = Reflect.get(target, "cmd-set")
			if (t.name != target.name) {
				t.name = target.name
				t.target = target
			}
			return t;
		}
		else return new XComConfig(target);
	};

	static set(target: Constructor, callback: (cmdSet: XComConfig) => XComConfig) {
		const value = callback(this.get(target));
		Reflect.set(target, "cmd-set", value);
	}

	getCmd(name: string | symbol, c: string) {
		if (this.cmdConfigs.hasOwnProperty(name)) {
			if(this.cmdConfigs[name.toString()].c != c) this.cmdConfigs[name.toString()].c = c;
		} else this.cmdConfigs[name.toString()] = new CommandConfig(name.toString(), c);
		return this.cmdConfigs[name.toString()]
	}

	static getConfigsFromCommandSets(commands: {}[]) {
		return commands.map(command => Reflect.get(command, "cmd-set"));
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

	constructor(public func: string, public c: string) {this.alias = func;}
}