"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_type_1 = require("../response-type");
class ResponseJson extends response_type_1.ResponseType {
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