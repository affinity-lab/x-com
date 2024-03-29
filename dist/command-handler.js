"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const errors_1 = require("./errors");
const events_1 = require("./events");
class CommandHandler {
    targetObj;
    func;
    authenticated;
    cacheOptions;
    preprocess;
    validate;
    client;
    version;
    command;
    commandResolver;
    target;
    description;
    constructor(targetObj, func, authenticated, cacheOptions, preprocess, validate, client, version, command, commandResolver, target, description) {
        this.targetObj = targetObj;
        this.func = func;
        this.authenticated = authenticated;
        this.cacheOptions = cacheOptions;
        this.preprocess = preprocess;
        this.validate = validate;
        this.client = client;
        this.version = version;
        this.command = command;
        this.commandResolver = commandResolver;
        this.target = target;
        this.description = description;
    }
    toJSON() {
        return { ...this.target, authenticated: this.authenticated, cache: this.cacheOptions?.ttl, description: this.description };
    }
    async handle(req, res) {
        this.checkApiAccess(req);
        const authenticated = this.getAuthenticated(req);
        let { args, type, files } = this.commandResolver.requestParser.parse(req);
        req.context.set("client", this.client);
        req.context.set("version", this.version);
        req.context.set("command", this.command);
        req.context.set("authenticated", authenticated);
        req.context.set("request-type", type);
        this.commandResolver.eventEmitter?.emit(events_1.XCOM_API_EVENTS.REQUEST_ACCEPTED, req);
        if (this.preprocess !== undefined) {
            1;
            const ret = this.preprocess(args);
            if (ret)
                args = ret;
        }
        if (this.validate !== undefined)
            args = this.validate(args);
        const result = (this.commandResolver.cacheReader === undefined || this.cacheOptions === undefined || this.cacheOptions.ttl === undefined || this.cacheOptions.ttl < 1)
            ? await this.targetObj[this.func](args, req, files)
            : await this.commandResolver.cacheReader(async () => await this.targetObj[this.func](args, req, files), this.getCacheKey(args, authenticated), this.cacheOptions.ttl);
        // when we got result, we set the response cache control header
        if (this.cacheOptions?.cttl)
            res.header("cache-control", `max-age:${this.cacheOptions.cttl}`);
        return result;
    }
    getCacheKey(args, authenticated) {
        if (this.cacheOptions?.key !== undefined) {
            if (typeof this.cacheOptions.key === "string") {
                return this.cacheOptions.key;
            }
            else {
                return this.cacheOptions.key(args);
            }
        }
        return crypto_1.default.createHash("md5").update(this.client.name + "." + this.version + "/" + this.command +
            JSON.stringify(args) +
            (this.cacheOptions.user ? JSON.stringify(authenticated) : "")).digest("hex");
    }
    checkApiAccess(req) {
        if (!this.client.checkApiAccess(req))
            throw errors_1.xComError.clientNotAuthorized(); // Client not authorized
    }
    getAuthenticated(req) {
        const authenticated = this.client.getAuthenticated(req);
        if (this.authenticated && authenticated === undefined)
            throw errors_1.xComError.userNotAuthenticated(); // User not authenticated
        return authenticated;
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=command-handler.js.map