import {CacheOptions, Files} from "./types";
import {Request, Response} from "express";
import {CommandHandler} from "./command-handler";
import {xComError} from "./errors";
import {RequestParser} from "./request-parser";
import {ResponseType} from "./response-type";
import {EventEmitter} from "events";
import {XComConfig} from "./config";
import {fatalError} from "@affinity-lab/affinity-util";


type TResolvers =
	Record<string, // client
		Record<number, // version
			Record<string, // command
				CommandHandler
			>
		>
	>

type CacheReaderFunc = (handler: () => any, key: string, ttl: number) => Promise<any>;

type CommandResolverOptions = {
	requestParser: RequestParser,
	cacheReader: CacheReaderFunc | undefined,
	eventEmitter: EventEmitter
}

export class CommandResolver {

	readonly resolvers: TResolvers = {};
	readonly requestParser: RequestParser;
	readonly cacheReader: CacheReaderFunc | undefined;
	readonly eventEmitter: EventEmitter | undefined;

	constructor(
		private commandSets: Array<typeof Object>,
		options: Partial<CommandResolverOptions> = {}
	) {
		this.requestParser = options.requestParser === undefined ? new RequestParser() : options.requestParser;
		this.cacheReader = options.cacheReader;
		this.eventEmitter = options.eventEmitter;
		this.parse();
	}

	protected parse() {
		for (const targetClass of this.commandSets) {
			const cmdSetConfig = XComConfig.get(targetClass);

			const defaultAuthenticated = (cmdSetConfig.authenticated === undefined ? false : cmdSetConfig.authenticated);
			for (const cmdKey in cmdSetConfig.cmdConfigs) {

				const cmdConfig = cmdSetConfig.cmdConfigs[cmdKey];

				const defaultCacheOptions = (cmdConfig.cache === undefined ? undefined : cmdConfig.cache);
				const target: {[p:string]: (args: Record<string, any>, req: Request, files: Files) => Promise<any>} = new (targetClass as new () => {})();
				let func = cmdConfig.func;
				let authenticated: boolean = cmdConfig.authenticated === undefined ? defaultAuthenticated : cmdConfig.authenticated;
				const command = cmdSetConfig.alias + "." + cmdConfig.alias;

				/* Global clients */
				for (const client of cmdSetConfig.clients) {
					if (!Array.isArray(client.version)) client.version = [client.version];
					for (const version of client.version) {
						this.addCmd(new CommandHandler(
							target,
							func,
							authenticated,
							defaultCacheOptions,
							cmdConfig.preprocess,
							cmdConfig.validate,
							client.client,
							version,
							command,
							this,
							{"class": target.constructor.name, func},
							cmdConfig.description
						));
					}
				}

				/* Command clients */
				for (const client of cmdConfig.clients) {
					let cacheOptions: undefined | CacheOptions;
					if (client.cache === false) {
						cacheOptions = undefined;
					} else if (client.cache === true) {
						cacheOptions = defaultCacheOptions;
					} else {
						cacheOptions = client.cache;
					}

					if (!Array.isArray(client.version)) client.version = [client.version];
					for (const version of client.version) {
						this.addCmd(new CommandHandler(
							target,
							func,
							authenticated,
							cacheOptions,
							cmdConfig.preprocess,
							cmdConfig.validate,
							client.client,
							version,
							command,
							this,
							{"class": target.constructor.name, func},
							cmdConfig.description
						));
					}
				}
			}
		}
	}


	protected addCmd(cmd: CommandHandler) {
		if (!this.resolvers.hasOwnProperty(cmd.client.name)) this.resolvers[cmd.client.name] = {};
		if (!this.resolvers[cmd.client.name].hasOwnProperty(cmd.version)) this.resolvers[cmd.client.name][cmd.version] = {};
		if (this.resolvers[cmd.client.name][cmd.version].hasOwnProperty(cmd.command)) throw fatalError(`CommandResolver ${cmd.client.name}/${cmd.version}/${cmd.command} has double declaration!`);
		this.resolvers[cmd.client.name][cmd.version][cmd.command] = cmd;
	}

	async handle(client: string, version: number, command: string, req: Request, res: Response) {
		const c = this.resolvers[client];
		if (c === undefined) throw xComError.notFound(`client not found: ${client}`); // Client not found
		const v = c[version];
		if (v === undefined) throw xComError.notFound(`version not found ${client}.${version}`); // Version not found
		const cmd = v[command];
		if (cmd === undefined) throw xComError.notFound(`command not found ${client}.${version}/${command}`); // Command not found

		const result = await cmd.handle(req, res);
		if (result instanceof ResponseType) {
			await result.send(res);
		} else {
			res.json(result);
		}
	}
}
