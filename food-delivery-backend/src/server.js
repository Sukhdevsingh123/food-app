import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
// Ensure models are registered before routes are loaded
import "./models/Category.js";
import "./models/MenuItem.js";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});


app.set("io", io);

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
});

server.listen(process.env.PORT || 5001, () =>
    console.log(`Server running on port ${process.env.PORT || 5001}`)
);