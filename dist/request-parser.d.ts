import { Request } from "express";
import { Files, IRequestParser } from "./types";
export declare class RequestParser implements IRequestParser {
    parse(req: Request): {
        type: "json" | "form-data";
        args: Record<string, any>;
        files: Files;
    };
}
