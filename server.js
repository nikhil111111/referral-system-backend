
// Created By: Nikhil Garg


import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import earningRoutes from "./routes/earningRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully Connected to MongoDB"))
    .catch(() => console.log("Connection failed"));

app.use('/api/users', userRoutes);
app.use('/api/earnings', earningRoutes);
app.use("/api/purchase", purchaseRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

export { io };

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room.`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log(`erver running on port ${process.env.PORT}`);
});
