"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendExpressRequest = void 0;
const crypto_1 = __importDefault(require("crypto"));
function extendExpressRequest(req, res, next) {
    req.id = crypto_1.default.randomInt(999999999).toString().padStart(9, "0").replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
    req.context = new Map();
    req.hasHeader = function (header) {
        return this.headers[header] !== undefined;
    };
    req.getHeader = function (header) {
        if (!this.hasHeader(header))
            return undefined;
        let value = this.headers[header];
        if (typeof value === "string")
            return value;
        if (Array.isArray(value) && value.length > 0)
            return value[0];
        return undefined;
    };
    req.getNumHeader = function (header) {
        let value = this.getHeader(header);
        if (value === undefined)
            return undefined;
        value = parseInt(value);
        return Number.isNaN(value) ? undefined : value;
    };
    return next();
}
exports.extendExpressRequest = extendExpressRequest;
//# sourceMappingURL=extend-express-request.js.map