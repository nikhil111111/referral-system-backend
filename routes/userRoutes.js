/**
 * Created By: Nikhil Garg
 * Description: User routes for registration, fetching users, and generating earnings reports.
 * - POST /api/users/register : Register a new user with optional parent referral.
 * - GET /api/users/ : Fetch all users with populated referrals and parents (testing purpose).
 * - GET /api/users/:userId/earnings-report : Fetch earnings summary for a specific user.
 */



import express from "express";
import User from "../models/User.js";
import Earning from "../models/Earning.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, parentId } = req.body;
    try {
        const user = new User({ name, email });
        if (parentId) {
            const parent = await User.findById(parentId);
            if (parent && parent.referrals.length < 8) {
                user.parent = parent._id;
                user.level = parent.level + 1;
                parent.referrals.push(user._id);
                await parent.save();
            } else {
                return res.status(400).json({ error: "Invalid or exceeded referral limit" });
            }
        }
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//  my personal testing 
router.get("/", async (req, res) => {
    try {
        const users = await User.find().populate("referrals").populate("parent");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// report api 
router.get("/:userId/earnings-report", async (req, res) => {
    const { userId } = req.params;

    try {
        const earnings = await Earning.find({ user: userId });

        const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
        const directEarnings = earnings.filter(e => e.level === 1).reduce((sum, e) => sum + e.amount, 0);
        const indirectEarnings = earnings.filter(e => e.level === 2).reduce((sum, e) => sum + e.amount, 0);

        res.json({ userId, totalEarnings, directEarnings, indirectEarnings, earnings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
