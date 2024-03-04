import {CacheOptions, Files, IClient} from "./types";
import {Request, Response} from "express";
import crypto from "crypto";
import {xComError} from "./errors";
import {CommandResolver} from "./command-resolver";
import {XCOM_API_EVENTS} from "./events";

export class CommandHandler {
	constructor(
		readonly targetObj: {[p:string]: (args: Record<string, any>, req: Request, files: Files) => Promise<any>},
		readonly func: string,
		readonly authenticated: boolean,
		readonly cacheOptions: undefined | CacheOptions,
		readonly preprocess: undefined | ((args: Record<string, any>) => Record<string, any> | void),
		readonly validate: undefined | ((args: Record<string, any>) => Record<string, any>),
		readonly client: IClient,
		readonly version: number,
		readonly command: string,
		readonly commandResolver: CommandResolver,
		readonly target: { "class": string, func: string },
		readonly description?: string
	) {
	}

	toJSON() {
		return {...this.target, authenticated: this.authenticated, cache: this.cacheOptions?.ttl, description: this.description};
	}

	async handle(req: Request, res: Response) {
		this.checkApiAccess(req);
		const authenticated = this.getAuthenticated(req);
		let {args, type, files} = this.commandResolver.requestParser.parse(req);
		req.context.set("client", this.client);
		req.context.set("version", this.version);
		req.context.set("command", this.command);
		req.context.set("authenticated", authenticated);
		req.context.set("request-type", type);

		this.commandResolver.eventEmitter?.emit(XCOM_API_EVENTS.REQUEST_ACCEPTED, req);

		if (this.preprocess !== undefined) {1
			const ret = this.preprocess(args);
			if (ret) args = ret;
		}
		if (this.validate !== undefined) args = this.validate(args);

		const result = (this.commandResolver.cacheReader === undefined || this.cacheOptions === undefined || this.cacheOptions.ttl === undefined || this.cacheOptions.ttl < 1)
			? await this.targetObj[this.func](args, req, files)
			: await this.commandResolver.cacheReader(async () => await this.targetObj[this.func](args, req, files), this.getCacheKey(args, authenticated), this.cacheOptions.ttl);
		// when we got result, we set the response cache control header
		if (this.cacheOptions?.cttl) res.header("cache-control", `max-age:${this.cacheOptions.cttl}`);
		return result;
	}

	protected getCacheKey(args: Record<string, any>, authenticated?: string) {
		if (this.cacheOptions?.key !== undefined) {
			if (typeof this.cacheOptions.key === "string") {
				return this.cacheOptions.key;
			} else {
				return this.cacheOptions.key(args);
			}
		}
		return crypto.createHash("md5").update(
			this.client.name + "." + this.version + "/" + this.command +
			JSON.stringify(args) +
			(this.cacheOptions!.user ? JSON.stringify(authenticated) : "")
		).digest("hex");
	}

	protected checkApiAccess(req: Request) {
		if (!this.client.checkApiAccess(req)) throw xComError.clientNotAuthorized(); // Client not authorized
	}

	protected getAuthenticated(req: Request) {
		const authenticated = this.client.getAuthenticated(req);
		if (this.authenticated && authenticated === undefined) throw xComError.userNotAuthenticated(); // User not authenticated
		return authenticated;
	}

}