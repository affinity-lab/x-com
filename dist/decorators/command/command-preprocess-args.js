"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPreprocessArgs = void 0;
const config_1 = require("../../config");
const CommandPreprocessArgs = function (sanitize) {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey);
            cmd.sanitize = sanitize;
            return cmdSet;
        });
    };
};
exports.CommandPreprocessArgs = CommandPreprocessArgs;
//# sourceMappingURL=command-preprocess-args.js.map