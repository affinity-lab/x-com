"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_type_1 = require("../response-type");
class ResponseDownload extends response_type_1.ResponseType {
    result;
    filename;
    constructor(result, filename) {
        super();
        this.result = result;
        this.filename = filename;
    }
    async send(res) {
        res.attachment(this.filename);
        res.send(this.result);
    }
}
//# sourceMappingURL=response-download.js.map