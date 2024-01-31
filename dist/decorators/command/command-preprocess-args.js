"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPreprocessArgs = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const CommandPreprocessArgs = function (preprocess) {
    return function (target, propertyKey) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target.constructor, true).set(["command", propertyKey.toString(), "preprocess"], preprocess);
    };
};
exports.CommandPreprocessArgs = CommandPreprocessArgs;
//# sourceMappingURL=command-preprocess-args.js.map