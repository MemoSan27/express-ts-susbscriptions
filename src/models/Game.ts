import { ObjectId } from "mongodb";

export interface Game {
    _id?: ObjectId;
    title: string;
    description: string;
    idRequiredMembership: string; 
}