"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDescription = void 0;
const config_1 = require("../../config");
const CommandDescription = (description) => {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey, target.constructor.name);
            cmd.description = description;
            return cmdSet;
        });
    };
};
exports.CommandDescription = CommandDescription;
//# sourceMappingURL=command-description.js.map