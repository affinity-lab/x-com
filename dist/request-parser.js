"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParser = void 0;
const file_field_1 = require("./file-field");
const errors_1 = require("./errors");
class RequestParser {
    parse(req) {
        let type;
        let args;
        let files = {};
        if (req.is("application/json")) {
            type = "json";
            args = req.body;
        }
        else if (req.is("multipart/form-data")) {
            type = "form-data";
            args = req.body;
            if (req.files !== undefined) {
                for (const file of req.files) {
                    if (files[file.fieldname] === undefined)
                        files[file.fieldname] = [];
                    files[file.fieldname].push(new file_field_1.FileField(file.originalname, file.mimetype, file.size, file.buffer));
                }
            }
        }
        else {
            throw errors_1.xComError.requestTypeNotAccepted();
        }
        return { type, args, files };
    }
}
exports.RequestParser = RequestParser;
//# sourceMappingURL=request-parser.js.map