"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const config_1 = require("../../config");
const Command = (alias) => {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey);
            if (alias)
                cmd.alias = alias;
            return cmdSet;
        });
    };
};
exports.Command = Command;
//# sourceMappingURL=command.js.map