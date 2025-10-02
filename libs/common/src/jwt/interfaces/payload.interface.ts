import { ObjectId } from "typeorm";

export interface IPayload {
    id: ObjectId;
    username: string;
    exp?: number;
    iat?: number;
}