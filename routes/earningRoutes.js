/**
 * Created By: Nikhil Garg
 * Description: Earnings routes for creating and fetching earnings.
 */


import express from "express";
import Earning from "../models/Earning.js";

const router = express.Router();

// create new earning
router.post("/add", async (req, res) => {
    const { userId, amount, sourceId, level } = req.body;
    try {
        const earning = new Earning({
            user: userId,
            amount,
            source: sourceId,
            level
        });
        await earning.save();
        res.status(201).json(earning);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all earnings
router.get("/", async (req, res) => {
    try {
        const earnings = await Earning.find().populate("user").populate("source");
        res.json(earnings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
