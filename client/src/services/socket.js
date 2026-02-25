import { io } from "socket.io-client";

const socket = io("https://food-app-kuhy.onrender.com");

export default socket;