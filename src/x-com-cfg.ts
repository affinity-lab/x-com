import {CommandHandler} from "./command-handler";
import {ClassMetaData} from "./util/class-meta-data";
import {CacheOptions, CommandSet, IClient} from "./types";
import {CommandResolver} from "./command-resolver";

type Constructor = (new () => Object) | Function;


type XComMeta = {
	xcom: {
		authenticated?: boolean,
		clients?: Array<{ client: IClient, version: number | Array<number>, cache?: CacheOptions }>,
		alias?: string,
	},
	command: Record<string, {
		alias: string,
		authenticated?: boolean,
		cache: CacheOptions,
		clients: Array<{ client: IClient, version: number | Array<number>, cache?: CacheOptions }>,
		description?: string,
		preprocess: (args: Record<string, any>) => any
		validate: (args: Record<string, any>) => Record<string, any>
	}>
}


class XComCfg {

	readonly metadataStore: ClassMetaData = new ClassMetaData();

	public parseXComMeta(target: Constructor, commandResolver: CommandResolver): CommandHandler[] {
		const meta = this.metadataStore.read(target) as XComMeta;
		const commandHandlers: CommandHandler[] = [];

		const xcomInstance = new (target as new () => CommandSet)();
		const xcom = {
			alias: meta.xcom.alias,
			authenticated: meta.xcom.authenticated === undefined ? false : meta.xcom.authenticated,
			clients: meta.xcom.clients === undefined ? [] : meta.xcom.clients
		};

		for (const func in meta.command) {
			const commandCfg = meta.command[func];

			const authenticated = commandCfg.authenticated !== undefined ? commandCfg.authenticated : xcom.authenticated;

			// preprocess clients
			const clientsCfg = commandCfg.clients !== undefined ? [...commandCfg.clients, ...xcom.clients] : xcom.clients;
			const clients: Record<string, { client: IClient, version: number | Array<number>, cache?: CacheOptions }> = {};
			for (const clientCfg of clientsCfg) {
				if (!Array.isArray(clientCfg.version)) clientCfg.version = [clientCfg.version];
				for (const version of clientCfg.version) {
					clients[`${clientCfg.client.name}.${version}`] = {
						client: clientCfg.client,
						version: version,
						cache: clientCfg.cache === undefined ? commandCfg.cache : clientCfg.cache
					};
				}
			}

			for (const key in clients) {
				const client = clients[key];
				const handler = new CommandHandler(
					xcomInstance,
					func,
					commandCfg.authenticated === undefined ? authenticated : commandCfg.authenticated,
					client.cache,
					commandCfg.preprocess,
					commandCfg.validate,
					client.client,
					client.version as number,
					xcom.alias + "." + commandCfg.alias,
					commandResolver,
					{class: target.name, func},
					commandCfg.description
				);
			}
		}

		return commandHandlers;
	}
}

export let xcomCfg: XComCfg = new XComCfg();