import { ObjectId } from "mongodb";

export interface Admininst{
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
}