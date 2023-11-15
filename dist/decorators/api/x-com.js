"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XCom = void 0;
const config_1 = require("../../config");
const XCom = (alias) => {
    return function (target) {
        config_1.XComConfig.set(target, cmdSet => {
            if (alias)
                cmdSet.alias = alias;
            return cmdSet;
        });
    };
};
exports.XCom = XCom;
//# sourceMappingURL=x-com.js.map