import { ObjectId } from "mongodb";

export interface Download{
    _id?: ObjectId;
    idCustomer: string;
    idGame: string;
    downloadDate: Date;
}