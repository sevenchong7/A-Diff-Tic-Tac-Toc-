import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { GameState } from "../../shared/types/game";
const socket = io("http://localhost:3000");

function App() {
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const createGame = () => {
    const gameId = "test-game";

    socket.emit("create-game", gameId);
  };

  const joinGame = () => {
    const gameId = "test-game";

    socket.emit("join-game", gameId);
  };

    useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to server:", socket.id);
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server");
      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const handleGameCreated = (data: { gameId: string }) => {
      console.log("Game created:", data.gameId);
    };

    socket.on("game-created", handleGameCreated);

    const handleGameJoined = (data: { gameId: string }) => {
      console.log("Game joined:", data.gameId);
    };

    socket.on("game-joined", handleGameJoined);

    const handleGameStarting = (data: {
      gameId: string;
      gameState: GameState;
    }) => {
      console.log("Game starting!");
      console.log("Game ID:", data.gameId);
      // console.log("Game state:", data.gameState);
      
      setGameState(data.gameState);
    };

    socket.on("game-starting", handleGameStarting);

    return ()=>{
      socket.off("game-created", handleGameCreated);
      socket.off("game-joined", handleGameJoined);
      socket.off("game-starting", handleGameStarting);
    }

  }, []);

  useEffect(()=>{

  }, []);


  return (
    <div>
      <h1>A Bit Diff Tic Tac Toe</h1>

      <p>
        Server status:{" "}
        {connected ? "Connected" : "Disconnected"}
      </p>

      <button onClick={createGame}>
        Create Game
      </button>


      <button onClick={joinGame}>
        Join Game
      </button>

      {gameState && (
        <div>
          <h2>Game State</h2>

          <p>Status: {gameState.status}</p>

          <div>
            <h2>
              Board ({gameState.board.rows} ×{" "}
              {gameState.board.columns})
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gameState.board.columns}, 80px)`,
                gap: "4px",
              }}
            >
              {gameState.board.cells.map((row, rowIndex) =>
                row.map((cell, columnIndex) => (
                  <div
                    key={`${rowIndex}-${columnIndex}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      border: "1px solid black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                    }}
                  >
                    {cell.sign ?? ""}
                  </div>
                ))
              )}
            </div>
          </div>

          <p>
            Current Player:{" "}
            {gameState.currentPlayerId ?? "None"}
          </p>

          <h3>Players</h3>

          {gameState.players.map((player) => (
            <div key={player.id}>
              <p>
                {player.sign} - {player.id}
              </p>

              <p>
                Character:{" "}
                {player.character ?? "Not selected"}
              </p>

              <p>
                Win Requirement: {player.winRequirement}
              </p>

              <p>
                Cards: {player.cards.length}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;