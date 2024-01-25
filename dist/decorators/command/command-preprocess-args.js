"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPreprocessArgs = void 0;
const config_1 = require("../../config");
const CommandPreprocessArgs = function (preprocess) {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey, target.constructor.name);
            cmd.preprocess = preprocess;
            return cmdSet;
        });
    };
};
exports.CommandPreprocessArgs = CommandPreprocessArgs;
//# sourceMappingURL=command-preprocess-args.js.map