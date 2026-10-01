import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { GameState } from "../../shared/types/game";
import type { CardAction } from "../../server/src/game/cards/CardAction";


const socket = io("http://localhost:3000");

function App() {
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: number;
  } | null>(null);

  const [selectedDirection, setSelectedDirection] =
    useState<"left" | "right" | "up" | "down"| null>(null);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const [selectedLineType, setSelectedLineType] =
    useState<"row" | "column" | null>(null);

  const [selectedPosition, setSelectedPosition] =
    useState<number | null>(null);

  const createGame = () => {
    const gameId = "test-game";

    socket.emit("create-game", gameId);
  };

  const joinGame = () => {
    const gameId = "test-game";

    socket.emit("join-game", gameId);
  };

  const selectCharacter = (character: string) => {
    socket.emit("select-character", {
      gameId: "test-game",
      character,
    });
  };

  const placeSign = (
    row: number,
    column: number
  ) => {
    socket.emit("place-sign", {
      gameId: "test-game",
      row,
      column,
    });
  };

  const currentPlayer = gameState?.players.find(
    (player) => player.id === socket.id
  );

  const useCard = (
    cardId: string,
    action: CardAction
  ) => {
    socket.emit("use-card", {
      gameId: "test-game",
      cardId,
      action,
    });
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

    return ()=>{
      socket.off("game-created", handleGameCreated);
    }

  }, []);


  useEffect(() => {
    const handleGameJoined = (data: { gameId: string }) => {
      console.log("Game joined:", data.gameId);
    };

    socket.on("game-joined", handleGameJoined);

    return ()=>{
      socket.off("game-joined", handleGameJoined);
    }

  },[]);

  useEffect(() => {
    const handleGameStarting = (data: {
      gameId: string;
      gameState: GameState;
    }) => {
      console.log("Game starting!");
      console.log("Game ID:", data.gameId);
      console.log("Game state:", data.gameState);
      
      setGameState(data.gameState);
    };
    
    socket.on("game-starting", handleGameStarting);

    return ()=>{
      socket.off("game-starting", handleGameStarting);
    }

  },[]);

  useEffect(() => {
    const handleGameState = (data: {
      gameState: GameState;
    }) => {
      console.log(
        "Game state updated:",
        data.gameState
      );

      setGameState(data.gameState);
    };

    socket.on("game-state", handleGameState);

    return () => {
      socket.off("game-state", handleGameState);
    };
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


    {gameState?.status === "CHARACTER_SELECT" && (
      <div>
      
        <h2>Select Character</h2>

        <button
          type="button"
          onClick={() =>
            selectCharacter("DOUBLE_SKILL")
          }
        >
          Double Skill
        </button>

        <button
          type="button"
          onClick={() =>
            selectCharacter("DOUBLE_DRAW")
          }
        >
          Double Draw
        </button>

        <button
          type="button"
          onClick={() =>
            selectCharacter("DOUBLE_PLACEMENT")
          }
        >
          Double Placement
        </button>
      </div>
    )}

      {(gameState?.status === "PLAYING" || gameState?.status === "DRAW" || gameState?.status === "FINISHED") && (
        <div>
          <h2>Game State</h2>

          <p>Status: {gameState.status}</p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                row.map((cell, columnIndex) => {
                  const isBlockedByMe =
                    cell.blocked &&
                    cell.blockedByPlayerId === socket.id;

                  const isBlockedByOpponent =
                    cell.blocked &&
                    cell.blockedByPlayerId !== socket.id;

                  return (
                    <button
                      key={`${rowIndex}-${columnIndex}`}
                      type="button"
                      onClick={() => {
                        if (activeCardId !== null) {
                          const activeCard = currentPlayer?.cards.find(
                            (card) => card.id === activeCardId
                          );

                          if (
                            activeCard?.type ==="MOVE_SIGN_HORIZONTAL"||
                            activeCard?.type === "MOVE_SIGN_VERTICAL"
                          ) {
                            if (cell.sign !== currentPlayer?.sign) {
                              return;
                            }
                          }

                          setSelectedCell({
                            row: rowIndex,
                            column: columnIndex,
                          });

                          return;
                        }

                        placeSign(rowIndex, columnIndex);
                      }}
                      style={{
                        width: "80px",
                        height: "80px",
                        border: "1px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",

                        backgroundColor:
                          selectedCell?.row === rowIndex &&
                          selectedCell?.column === columnIndex
                            ? "lightgreen"
                            : isBlockedByMe
                              ? "lightblue"
                              : isBlockedByOpponent
                                ? "lightcoral"
                                : "white",
                      }}
                    >
                      {cell.sign ?? ""}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {currentPlayer && (
            <div>
              <h2>Your Cards</h2>

              {currentPlayer.needsDiscard && (
                <p>
                  You have too many cards. Please discard
                  one card.
                </p>
              )}

              <div>
                {currentPlayer.cards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      border: "1px solid black",
                      padding: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <h3>{card.name}</h3>

                    <p>{card.description}</p>

                    {currentPlayer.needsDiscard ? (
                      <button
                        type="button"
                        onClick={() => {
                          socket.emit("discard-card", {
                            gameId: "test-game",
                            cardId: card.id,
                          });
                        }}
                      >
                        Discard
                      </button>
                    ) : (
                      <>
                        {card.type === "MOVE_SIGN_HORIZONTAL" && (
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCardId(card.id);
                                setSelectedCell(null);
                                setSelectedDirection(null);
                              }}
                            >
                              Select Sign
                            </button>

                            {activeCardId === card.id && (
                              <div>
                                <p>
                                  Selected sign:{" "}
                                  {selectedCell
                                    ? `Row ${selectedCell.row}, Column ${selectedCell.column}`
                                    : "Click your sign on the board"}
                                </p>

                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDirection("left");
                                    }}
                                  >
                                    ← Left
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDirection("right");
                                    }}
                                  >
                                    Right →
                                  </button>
                                </div>

                                <p>
                                  Direction:{" "}
                                  {selectedDirection ?? "Not selected"}
                                </p>

                                <button
                                  type="button"
                                  disabled={
                                    !selectedCell ||
                                    !selectedDirection
                                  }
                                  onClick={() => {
                                    if (
                                      !selectedCell ||
                                      !selectedDirection
                                    ) {
                                      return;
                                    }

                                    useCard(card.id, {
                                      row: selectedCell.row,
                                      column: selectedCell.column,
                                      direction: selectedDirection,
                                    });

                                    setSelectedCell(null);
                                    setSelectedDirection(null);
                                    setActiveCardId(null);
                                  }}
                                >
                                  Use Card
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {card.type === "MOVE_SIGN_VERTICAL" && (
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCardId(card.id);
                                setSelectedCell(null);
                                setSelectedDirection(null);
                              }}
                            >
                              Select Sign
                            </button>

                            {activeCardId === card.id && (
                              <div>
                                <p>
                                  Selected sign:{" "}
                                  {selectedCell
                                    ? `Row ${selectedCell.row}, Column ${selectedCell.column}`
                                    : "Click your sign on the board"}
                                </p>

                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDirection("up");
                                    }}
                                  >
                                    ↑ Up
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDirection("down");
                                    }}
                                  >
                                    ↓ Down
                                  </button>
                                </div>

                                <p>
                                  Direction:{" "}
                                  {selectedDirection ?? "Not selected"}
                                </p>

                                <button
                                  type="button"
                                  disabled={
                                    !selectedCell ||
                                    !selectedDirection
                                  }
                                  onClick={() => {
                                    if (
                                      !selectedCell ||
                                      !selectedDirection
                                    ) {
                                      return;
                                    }

                                    useCard(card.id, {
                                      row: selectedCell.row,
                                      column: selectedCell.column,
                                      direction: selectedDirection,
                                    });

                                    setSelectedCell(null);
                                    setSelectedDirection(null);
                                    setActiveCardId(null);
                                  }}
                                >
                                  Use Card
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {card.type === "MOVE_ROW_COLUMN" && (
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCardId(card.id);
                                setSelectedLineType(null);
                                setSelectedPosition(null);
                              }}
                            >
                              Select Row / Column
                            </button>

                            {activeCardId === card.id && (
                              <div>
                                <p>Choose what to move:</p>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLineType("row");
                                    setSelectedPosition(null);
                                  }}
                                >
                                  Row
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLineType("column");
                                    setSelectedPosition(null);
                                  }}
                                >
                                  Column
                                </button>

                                {selectedLineType && (
                                  <div>
                                    <p>
                                      Selected: {selectedLineType}
                                    </p>

                                    <label>
                                      Position:

                                      <select
                                        value={selectedPosition ?? ""}
                                        onChange={(event) => {
                                          setSelectedPosition(
                                            Number(event.target.value)
                                          );
                                        }}
                                      >
                                        <option value="">
                                          Select position
                                        </option>

                                        {Array.from(
                                          {
                                            length:
                                              selectedLineType === "row"
                                                ? gameState!.board.rows
                                                : gameState!.board.columns,
                                          },
                                          (_, index) => (
                                            <option
                                              key={index}
                                              value={index}
                                            >
                                              {index}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </label>
                                  </div>
                                )}

                                {
                                  selectedPosition !== null &&(
                                    <div>
                                      {
                                        selectedLineType === "row" ? (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedDirection("left");
                                              }}
                                            >
                                              ← Left
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedDirection("right");
                                              }}
                                            >
                                              Right →
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedDirection("up");
                                              }}
                                            >
                                              ↑ Up
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedDirection("down");
                                              }}
                                            >
                                              ↓ Down
                                            </button>
                                          </>
                                        )
                                      }
                                    </div>
                                  )
                                }

                                <button
                                  type="button"
                                  disabled={
                                    selectedLineType === null ||
                                    selectedPosition === null
                                  }
                                  onClick={() => {
                                    if (
                                      selectedLineType === null ||
                                      selectedPosition === null
                                    ) {
                                      return;
                                    }

                                    if(selectedLineType === "row"){
                                      useCard(card.id, {
                                        row : selectedPosition,
                                        direction: selectedDirection,
                                      });
                                    }

                                    if(selectedLineType === "column"){
                                      useCard(card.id, {
                                        column : selectedPosition,
                                        direction: selectedDirection,
                                      });
                                    }

                                    setActiveCardId(null);
                                    setSelectedLineType(null);
                                    setSelectedPosition(null);
                                    setSelectedDirection(null);
                                  }}
                                >
                                  Use Card
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {card.type === "BLOCK_CELL" && (
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCardId(card.id);
                                setSelectedCell(null);
                              }}
                            >
                              Select Cell
                            </button>

                            {activeCardId === card.id && (
                              <div>
                                <p>
                                  Selected:{" "}
                                  {selectedCell
                                    ? `Row ${selectedCell.row}, Column ${selectedCell.column}`
                                    : "Click a cell on the board"}
                                </p>

                                <button
                                  type="button"
                                  disabled={!selectedCell}
                                  onClick={() => {
                                    if (!selectedCell) {
                                      return;
                                    }

                                    useCard(card.id, {
                                      row: selectedCell.row,
                                      column: selectedCell.column,
                                    });

                                    setSelectedCell(null);
                                    setActiveCardId(null);
                                  }}
                                >
                                  Use Card
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* <p>
            Current Player:{" "}
            {gameState.currentPlayerId ?? "None"}
          </p>

          <h3>Players</h3> */}

          {/* {gameState.players.map((player) => (
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
          ))} */}
        </div>
      )}
    </div>
  );
}

export default App;