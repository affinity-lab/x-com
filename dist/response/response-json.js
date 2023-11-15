"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("../responseType");
class ResponseJson extends responseType_1.ResponseType {
    result;
    constructor(result) {
        super();
        this.result = result;
    }
    async send(res) {
        return res.json(this.result);
    }
}
//# sourceMappingURL=response-json.js.map