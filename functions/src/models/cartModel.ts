import { ObjectId } from "mongodb";

export default interface cart {
    _id?: ObjectId;
    product: string;
    price: number;
    quantity: number;
}