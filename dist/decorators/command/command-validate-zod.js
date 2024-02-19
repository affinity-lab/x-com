"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandValidateZod = void 0;
const affinity_util_1 = require("@affinity-lab/affinity-util");
const x_com_cfg_1 = require("../../x-com-cfg");
const CommandValidateZod = function (zodPattern) {
    return function (target, propertyKey) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target.constructor, true).set(["command", propertyKey.toString(), "validator"], (args) => {
            let parsed = zodPattern.safeParse(args);
            if (!parsed.success)
                throw new affinity_util_1.ExtendedError("Validation extended-error", "VALIDATION_ERROR", parsed.error.issues, 400);
            return parsed.data;
        });
    };
};
exports.CommandValidateZod = CommandValidateZod;
//# sourceMappingURL=command-validate-zod.js.map