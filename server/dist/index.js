import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { GameRoom } from "./rooms/GameRoom";
import { SERVER_PORT } from "coconutclash-shared";
import path from "path";
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const gameServer = new Server({
    transport: new WebSocketTransport({
        server
    })
});
// Register the game room
gameServer.define("game_room", GameRoom);
// In production, serve the built client files
if (process.env.NODE_ENV === "production") {
    const clientDist = path.join(__dirname, "../../../client/dist");
    app.use(express.static(clientDist));
    app.get("*", (req, res) => {
        res.sendFile(path.join(clientDist, "index.html"));
    });
}
gameServer.listen(SERVER_PORT);
console.log(`🌴 CoconutClash server running on ws://localhost:${SERVER_PORT}`);
//# sourceMappingURL=index.js.map