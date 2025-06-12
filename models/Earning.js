import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    level: Number,
    timestamp: { type: Date, default: Date.now }
});

const Earning = mongoose.model('Earning', earningSchema);

export default Earning;
