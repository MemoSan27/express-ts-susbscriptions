import { ObjectId } from "mongodb";

export interface Administ{
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
}