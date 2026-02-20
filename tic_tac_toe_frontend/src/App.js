import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Returns "X" or "O" if there's a winner, otherwise null.
 * Winning lines are the 8 standard Tic-Tac-Toe combinations.
 */
function getWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return v;
  }
  return null;
}

function isDraw(squares, winner) {
  return !winner && squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Board is a flat array of 9 cells: "X" | "O" | null */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** X always starts. */
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => getWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares, winner), [squares, winner]);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "Draw game";
    return `Turn: ${xIsNext ? "X" : "O"}`;
  }, [winner, draw, xIsNext]);

  const canPlay = !winner && !draw;

  const handleSquareClick = (idx) => {
    if (!canPlay) return;
    if (squares[idx] !== null) return;

    setSquares((prev) => {
      const next = [...prev];
      next[idx] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-label="Tic Tac Toe game">
          <h1 className="ttt-title">Tic Tac Toe</h1>

          <p
            className={`ttt-status ${winner ? "is-winner" : ""} ${
              draw ? "is-draw" : ""
            }`}
            aria-live="polite"
          >
            {statusText}
          </p>

          <div
            className="ttt-board"
            role="grid"
            aria-label="Tic Tac Toe board (3 by 3)"
          >
            {squares.map((value, idx) => {
              const label = value
                ? `Cell ${idx + 1}, ${value}`
                : `Cell ${idx + 1}, empty`;
              return (
                <button
                  key={idx}
                  type="button"
                  className="ttt-square"
                  onClick={() => handleSquareClick(idx)}
                  disabled={!canPlay || value !== null}
                  aria-label={label}
                  role="gridcell"
                >
                  <span className="ttt-mark" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <button type="button" className="ttt-reset" onClick={resetGame}>
            Reset
          </button>

          <p className="ttt-hint">
            Two players, one device. X starts. Tap a tile to play.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
