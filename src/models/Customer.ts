import { ObjectId } from "mongodb";

export interface Customer{
    _id?: ObjectId;
    name: string;
    lastname: string;
    email: string;
    password: string;
    membershipId: ObjectId;
}