import { ObjectId } from "mongodb";

export interface Download{
    _id?: ObjectId;
    idCustomer: ObjectId;
    idGame: ObjectId;
    downloadDate: Date;
}