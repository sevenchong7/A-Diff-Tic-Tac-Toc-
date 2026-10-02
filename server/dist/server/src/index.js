"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const Game_1 = require("./game/Game");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({
        message: "A Bit Diff Tic Tac Toe server is running!",
    });
});
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});
const gameRooms = new Map();
io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
    });
    socket.on("create-game", (gameId) => {
        if (gameRooms.has(gameId)) {
            socket.emit("game-error", {
                message: "Game already exists",
            });
            return;
        }
        socket.join(gameId);
        gameRooms.set(gameId, {
            players: [socket.id],
        });
        console.log(`Player 1 ${socket.id} created game ${gameId}`);
        socket.emit("game-created", {
            gameId,
            playerNumber: 1,
        });
    });
    socket.on("join-game", (gameId) => {
        const room = gameRooms.get(gameId);
        if (!room) {
            socket.emit("game-error", {
                message: "Game not found",
            });
            return;
        }
        if (room.players.length >= 2) {
            socket.emit("game-error", {
                message: "Game is full",
            });
            return;
        }
        socket.join(gameId);
        room.players.push(socket.id);
        const game = new Game_1.Game(room.players[0], room.players[1], 3, 3, 3);
        room.game = game;
        io.to(gameId).emit("game-starting", {
            gameId,
            gameState: game.getGameState(),
        });
        console.log(`Player 2 ${socket.id} joined game ${gameId}`);
        socket.emit("game-joined", {
            gameId,
            playerNumber: 2,
        });
    });
    socket.on("select-character", (data) => {
        const room = gameRooms.get(data.gameId);
        if (!room || !room.game) {
            socket.emit("game-error", {
                message: "Game not found",
            });
            return;
        }
        try {
            room.game.selectCharacter(socket.id, data.character);
            io.to(data.gameId).emit("game-state", {
                gameState: room.game.getGameState(),
            });
        }
        catch (error) {
            socket.emit("game-error", {
                message: error instanceof Error
                    ? error.message
                    : "Failed to select character",
            });
        }
    });
    socket.on("place-sign", (data) => {
        const room = gameRooms.get(data.gameId);
        if (!room || !room.game) {
            socket.emit("game-error", {
                message: "Game not found",
            });
            return;
        }
        try {
            room.game.placeSign(socket.id, data.row, data.column);
            io.to(data.gameId).emit("game-state", {
                gameState: room.game.getGameState(),
            });
        }
        catch (error) {
            socket.emit("game-error", {
                message: error instanceof Error
                    ? error.message
                    : "Failed to place sign",
            });
        }
    });
    socket.on("discard-card", (data) => {
        const room = gameRooms.get(data.gameId);
        if (!room || !room.game) {
            socket.emit("game-error", {
                message: "Game not found",
            });
            return;
        }
        try {
            room.game.discardCard(socket.id, data.cardId);
            io.to(data.gameId).emit("game-state", {
                gameState: room.game.getGameState(),
            });
        }
        catch (error) {
            socket.emit("game-error", {
                message: error instanceof Error
                    ? error.message
                    : "Failed to discard card",
            });
        }
    });
    socket.on("use-card", (data) => {
        const room = gameRooms.get(data.gameId);
        if (!room || !room.game) {
            socket.emit("game-error", {
                message: "Game not found",
            });
            return;
        }
        try {
            room.game.useCard(socket.id, data.cardId, data.action);
            io.to(data.gameId).emit("game-state", {
                gameState: room.game.getGameState(),
            });
        }
        catch (error) {
            socket.emit("game-error", {
                message: error instanceof Error
                    ? error.message
                    : "Failed to use card",
            });
        }
    });
    socket.on("activate-double-skill", (data) => {
        const room = gameRooms.get(data.gameId);
        if (!room || !room.game) {
            socket.emit("game-error", {
                message: "Game not found",
            });
            return;
        }
        try {
            room.game.activateDoubleSkill(socket.id);
            io.to(data.gameId).emit("game-state", {
                gameState: room.game.getGameState(),
            });
        }
        catch (error) {
            socket.emit("game-error", {
                message: error instanceof Error
                    ? error.message
                    : "Failed to activate Double Skill",
            });
        }
    });
    socket.on("activate-double-draw", ({ gameId }) => {
        try {
            const room = gameRooms.get(gameId);
            if (!room || !room.game) {
                socket.emit("game-error", {
                    message: "Game not found",
                });
                return;
            }
            room.game.activateDoubleDraw(socket.id);
            io.to(gameId).emit("game-state", {
                gameState: room.game.getGameState(),
            });
        }
        catch (error) {
            socket.emit("game-error", {
                message: error instanceof Error
                    ? error.message
                    : "Failed to activate Double Draw",
            });
        }
    });
    socket.on("activate-block-line", ({ gameId, type, index, }) => {
        try {
            const room = gameRooms.get(gameId);
            if (!room || !room.game) {
                socket.emit("game-error", {
                    message: "Game not found",
                });
                return;
            }
            room.game.activateBlockLine(socket.id, type, index);
            io.to(gameId).emit("game-state", {
                gameState: room.game.getGameState(),
            });
        }
        catch (error) {
            socket.emit("game-error", {
                message: error instanceof Error
                    ? error.message
                    : "Failed to activate Block Line",
            });
        }
    });
    //end of line
});
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
