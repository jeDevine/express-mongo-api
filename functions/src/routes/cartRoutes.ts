import express from 'express';
import cart from '../models/cartModel';
import {getClient} from "../db";
import { ObjectId } from 'mongodb';

const cartRoutes = express.Router();

cartRoutes.get('/cart-items', async (req, res) => {
    const product = String(req.query.product || "");
    const maxPrice = parseInt(req.query.maxPrice as string);
    const pageSize = parseInt(req.query.pageSize as string);
    try {
        const client = await getClient();
        if (product) {
            const results = await client.db().collection<cart>('cart_items').find({product: product}).toArray();
            console.log(results);
            res.status(200).json(results);
        } else if (maxPrice) {
            const results = await client.db().collection<cart>('cart_items').find({price: {$lte: maxPrice}}).toArray();
            console.log(results);
            res.status(200).json(results);
        } else if (pageSize) {
            const results = await client.db().collection<cart>('cart_items').find().limit(pageSize).toArray();
            console.log(results);
            res.status(200).json(results);
        } else {
            const results = await client.db().collection<cart>('cart_items').find().toArray();
            console.log(results);
            res.status(200).json(results);
        }
    } catch  (e) {
        console.error("Error ", e);
        res.status(500).json({message: "Internal Server Error"});
    }
})

cartRoutes.get('/cart-items/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const client = await getClient();
        const results = await client.db().collection<cart>('cart_items').findOne({_id: new ObjectId(id)});
        if (results) {
            res.json(results);
        } else {
            res.status(404).json({message: "Not Found"})
        }
    } catch (e) {
        console.error("Error ", e);
        res.status(500).json({message: "Internal Server Error"})
    }
})

cartRoutes.post("/cart-items", async (req, res) => {
    const cartItem = req.body as cart;
    try {
    const client = await getClient();
    await client.db().collection<cart>("cart_items").insertOne(cartItem);
    res.status(201).json(cartItem);
    } catch (e) {
        console.error("Error ", e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

cartRoutes.put("/cart-items/:id", async (req, res) => {
    const id = req.params.id;
    const cartItem = req.body as cart;
    delete cartItem._id;
    try {
        const client = await getClient();
        const result = await client.db().collection<cart>("cart_items").replaceOne({_id: new ObjectId(id)}, cartItem);
        if (result.modifiedCount === 0) {
            res.status(404).json({message: "Not Found"})
        } else {
            cartItem._id = new ObjectId(id);
            res.status(201).json(cartItem);
        }
    } catch (e) {
        console.error("Error ", e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

cartRoutes.delete('/cart-items/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const client = await getClient();
        const result = await client.db().collection<cart>("cart_items").deleteOne({_id: new ObjectId(id)});
        if (result.deletedCount === 0) {
            res.status(404).json({message: "Not Found"});
        } else {
            res.status(204).end();
        }
    } catch (e) {
        console.error("Error ", e);
        res.status(500).json({message: "Internal Server Error"});
    }
})

export default cartRoutes;