import { Response } from "express";
export declare abstract class ResponseType {
    abstract send(res: Response): Promise<unknown>;
}
