"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("../responseType");
class ResponseDownload extends responseType_1.ResponseType {
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