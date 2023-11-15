"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xComError = void 0;
const affinity_util_1 = require("@affinity-lab/affinity-util");
exports.xComError = {
    notFound: (message) => (0, affinity_util_1.createErrorData)(message, undefined, 404),
    clientNotAuthorized: () => (0, affinity_util_1.createErrorData)("client not authorized", undefined, 403),
    userNotAuthenticated: () => (0, affinity_util_1.createErrorData)("user not authorized", undefined, 401),
    requestTypeNotAccepted: () => (0, affinity_util_1.createErrorData)("request type not accepted")
};
(0, affinity_util_1.preprocessErrorTree)(exports.xComError, "X-COM");
//# sourceMappingURL=errors.js.map