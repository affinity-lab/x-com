"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandValidateZod = void 0;
const config_1 = require("../../config");
const affinity_util_1 = require("@affinity-lab/affinity-util");
const CommandValidateZod = function (zodPattern) {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey, target.constructor.name);
            cmd.validate = (args) => {
                let parsed = zodPattern.safeParse(args);
                if (!parsed.success)
                    throw new affinity_util_1.ExtendedError("Validation extended-error", "VALIDATION_ERROR", parsed.error.issues);
                return parsed.data;
            };
            return cmdSet;
        });
    };
};
exports.CommandValidateZod = CommandValidateZod;
//# sourceMappingURL=command-validate-zod.js.map