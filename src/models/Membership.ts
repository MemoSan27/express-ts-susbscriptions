import { ObjectId } from "mongodb";

export interface Membership {
    _id?: ObjectId;
    userId?: string;
    type: string;
    price: number;
}