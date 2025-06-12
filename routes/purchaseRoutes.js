/**
 * Created By: Nikhil Garg
 * Description: Handles purchases and earnings distribution.
 */

import express from "express";
import User from "../models/User.js";
import Earning from "../models/Earning.js";
import { io } from "../server.js";

const router = express.Router();

// POST /api/purchase
router.post("/", async (req, res) => {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
        return res.status(400).json({ error: "Missing userId or amount" });
    }

    if (amount < 1000) {
        return res.status(400).json({ error: "Purchase amount must exceed 1000" });
    }

    try {
        const buyer = await User.findById(userId).populate("parent");

        if (!buyer) {
            return res.status(404).json({ error: "User not found" });
        }

        if (buyer.parent && buyer.parent.status === 'active') {
            const directEarning = new Earning({
                user: buyer.parent._id,
                amount: amount * 0.05,
                source: buyer._id,
                level: 1
            });
            await directEarning.save();

            io.to(buyer.parent._id.toString()).emit("earning", {
                userId: buyer.parent._id,
                amount: directEarning.amount,
                level: 1,
                sourceUserId: buyer._id
            });
        }

        if (buyer.parent && buyer.parent.parent && buyer.parent.parent.status === 'active') {
            const indirectEarning = new Earning({
                user: buyer.parent.parent,
                amount: amount * 0.01,
                source: buyer._id,
                level: 2
            });
            await indirectEarning.save();

            io.to(buyer.parent.parent._id.toString()).emit("earning", {
                userId: buyer.parent.parent._id,
                amount: indirectEarning.amount,
                level: 2,
                sourceUserId: buyer._id
            });
        }

        res.status(200).json({ message: "Purchase processed and earnings distributed." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
