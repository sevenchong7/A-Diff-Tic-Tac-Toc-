import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./game/Game";
import { CardAction } from "./game/cards/CardAction";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "A Bit Diff Tic Tac Toe server is running!",
  });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

type GameRoom = {
  players: string[];
  game?: Game;
};

const gameRooms = new Map<string, GameRoom>();

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
  });

  socket.on("create-game", (gameId: string) => {
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

    console.log(
      `Player 1 ${socket.id} created game ${gameId}`
    );

    socket.emit("game-created", {
      gameId,
      playerNumber: 1,
    });
  });

  socket.on("join-game", (gameId: string) => {
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

    const game = new Game(
      room.players[0],
      room.players[1],
      3,
      3,
      3
    );

    room.game = game;

    io.to(gameId).emit("game-starting", {
      gameId,
      gameState: game.getGameState(),
    });

    console.log(
      `Player 2 ${socket.id} joined game ${gameId}`
    );

    socket.emit("game-joined", {
      gameId,
      playerNumber: 2,
    });
  });

  socket.on(
    "select-character",
    (data: {
      gameId: string;
      character: string;
    }) => {
      const room = gameRooms.get(data.gameId);

      if (!room || !room.game) {
        socket.emit("game-error", {
          message: "Game not found",
        });

        return;
      }

      try {
        room.game.selectCharacter(
          socket.id,
          data.character as any
        );

        io.to(data.gameId).emit("game-state", {
          gameState: room.game.getGameState(),
        });
      } catch (error) {
        socket.emit("game-error", {
          message:
            error instanceof Error
              ? error.message
              : "Failed to select character",
        });
      }
    }
  );

  socket.on(
    "place-sign",
    (data: {
      gameId: string;
      row: number;
      column: number;
    }) => {
      const room = gameRooms.get(data.gameId);

      if (!room || !room.game) {
        socket.emit("game-error", {
          message: "Game not found",
        });

        return;
      }

      try {
        room.game.placeSign(
          socket.id,
          data.row,
          data.column
        );

        io.to(data.gameId).emit("game-state", {
          gameState: room.game.getGameState(),
        });
      } catch (error) {
        socket.emit("game-error", {
          message:
            error instanceof Error
              ? error.message
              : "Failed to place sign",
        });
      }
    }
  );

  socket.on(
    "discard-card",
    (data: {
      gameId: string;
      cardId: string;
    }) => {
      const room = gameRooms.get(data.gameId);

      if (!room || !room.game) {
        socket.emit("game-error", {
          message: "Game not found",
        });

        return;
      }

      try {
        room.game.discardCard(
          socket.id,
          data.cardId
        );

        io.to(data.gameId).emit("game-state", {
          gameState: room.game.getGameState(),
        });
      } catch (error) {
        socket.emit("game-error", {
          message:
            error instanceof Error
              ? error.message
              : "Failed to discard card",
        });
      }
    }
  );

  socket.on(
    "use-card",
    (data: {
      gameId: string;
      cardId: string;
      action: CardAction;
    }) => {
      const room = gameRooms.get(data.gameId);

      if (!room || !room.game) {
        socket.emit("game-error", {
          message: "Game not found",
        });

        return;
      }

      try {
        room.game.useCard(
          socket.id,
          data.cardId,
          data.action
        );

        io.to(data.gameId).emit("game-state", {
          gameState: room.game.getGameState(),
        });
      } catch (error) {
        socket.emit("game-error", {
          message:
            error instanceof Error
              ? error.message
              : "Failed to use card",
        });
      }
    }
  );

});



const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});