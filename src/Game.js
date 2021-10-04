import "./Game.css";
import Board from "./Component/Board";
import { useEffect, useState } from "react";

function Game() {
  const [boardSize, setBoardSize] = useState(8);
  const [boardSizeInput, setBoardSizeInput] = useState(8);

  const boardInit = [];
  for (let i = 0; i < boardSize; i++) {
    const boardRow = [];
    for (let j = 0; j < boardSize; j++) {
      boardRow.push({ value: null, isHighLight: false });
    }
    boardInit.push(boardRow);
  }

  const [history, setHistory] = useState([{
    board: boardInit,
    stepNumber: 0,
    xIsNext: true,
    lastPosition: { row: null, col: null }
  }]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [status, setStatus] = useState("Next player: X");
  const [current, setCurrent] = useState(history[history.length - 1]);
  const [isDescending, setIsDescending] = useState(false);

  const calculateWinter = (currentStep) => {
    const board = currentStep.board;
    const { col, row } = currentStep.lastPosition;

    if (col == null || row == null) {
      return null;
    }

    const leftBound = Math.max(0, col - 4);
    const rightBound = Math.min(col, boardSize - 5);
    const topBound = Math.max(0, row - 4);
    const bottomBound = Math.min(row, boardSize - 5);

    //check in row
    for (let c = leftBound; c <= rightBound; c++) {
      if (board[row][c].value
          && board[row][c].value === board[row][c + 1].value
          && board[row][c + 1].value === board[row][c + 2].value
          && board[row][c + 2].value === board[row][c + 3].value
          && board[row][c + 3].value === board[row][c + 4].value) {
        board[row][c].isHighLight = true;
        board[row][c + 1].isHighLight = true;
        board[row][c + 2].isHighLight = true;
        board[row][c + 3].isHighLight = true;
        board[row][c + 4].isHighLight = true;
        return board[row][c].value;
      }
    }

    //check in column
    for (let r = topBound; r <= bottomBound; r++) {
      if (board[r][col].value
          && board[r][col].value === board[r + 1][col].value
          && board[r + 1][col].value === board[r + 2][col].value
          && board[r + 2][col].value === board[r + 3][col].value
          && board[r + 3][col].value === board[r + 4][col].value) {
        board[r][col].isHighLight = true;
        board[r + 1][col].isHighLight = true;
        board[r + 2][col].isHighLight = true;
        board[r + 3][col].isHighLight = true;
        board[r + 4][col].isHighLight = true;
        return board[r][col].value;
      }
    }

    //check in main diagonal line
    let countInMainDiag = 0;
    let offsetInMainDiag = -4;
    for (let i = -4; i <= 4; i++) {
      if (row + i >= 0 && row + i < boardSize
          && col + i >= 0 && col + i < boardSize
          && board[row + i][col + i].value === board[row][col].value) {
        countInMainDiag++;
      } else {
        offsetInMainDiag = i + 1;
        countInMainDiag = 0;
      }
      if (countInMainDiag === 5) {
        board[row + offsetInMainDiag][col + offsetInMainDiag].isHighLight = true;
        board[row + offsetInMainDiag + 1][col + offsetInMainDiag + 1].isHighLight = true;
        board[row + offsetInMainDiag + 2][col + offsetInMainDiag + 2].isHighLight = true;
        board[row + offsetInMainDiag + 3][col + offsetInMainDiag + 3].isHighLight = true;
        board[row + offsetInMainDiag + 4][col + offsetInMainDiag + 4].isHighLight = true;
        return board[row][col].value;
      }
    }

    //check in auxiliary diagonal line
    let countInAuxiliaryDiag = 0;
    let offsetInAuxiliaryDiag = -4;
    for (let i = -4; i <= 4; i++) {
      if (row + i >= 0 && row + i < boardSize
          && col - i >= 0 && col - i < boardSize
          && board[row + i][col - i].value === board[row][col].value) {
        countInAuxiliaryDiag++;
      } else {
        offsetInAuxiliaryDiag = i + 1;
        countInAuxiliaryDiag = 0;
      }
      if (countInAuxiliaryDiag === 5) {
        board[row + offsetInAuxiliaryDiag][col - offsetInAuxiliaryDiag].isHighLight = true;
        board[row + offsetInAuxiliaryDiag + 1][col - offsetInAuxiliaryDiag - 1].isHighLight = true;
        board[row + offsetInAuxiliaryDiag + 2][col - offsetInAuxiliaryDiag - 2].isHighLight = true;
        board[row + offsetInAuxiliaryDiag + 3][col - offsetInAuxiliaryDiag - 3].isHighLight = true;
        board[row + offsetInAuxiliaryDiag + 4][col - offsetInAuxiliaryDiag - 4].isHighLight = true;
        return board[row][col].value;
      }
    }

    return null;
  };

  const handleClick = (r, c) => {
    if (current.board[r][c].value) {
      return;
    }
    const newHistory = history.slice(0, current.stepNumber + 1);
    const currentBoard = JSON.parse(JSON.stringify(current.board));
    currentBoard[r][c].value = current.xIsNext ? "X" : "O";
    const newStep = {
      board: currentBoard,
      stepNumber: current.stepNumber + 1,
      xIsNext: !current.xIsNext,
      lastPosition: { row: r, col: c }
    };
    manageStatus(newStep);
    setHistory(newHistory.concat(newStep));
    setCurrent(newStep);
  };

  const jumpTo = (move) => {
    const descStep = { ...history.find((step => step.stepNumber === move)) };
    setCurrent(descStep);
    manageStatus(descStep);
  };

  const manageStatus = (currentStep) => {
    const winner = calculateWinter(currentStep);
    if (winner) {
      setStatus("Winner: " + winner);
      setIsPlaying(false);
    } else if (currentStep.stepNumber === boardSize * boardSize) {
      setStatus("Tie");
      setIsPlaying(false);
    } else {
      setStatus("Next player: " + (currentStep.xIsNext ? "X" : "O"));
      setIsPlaying(true);
    }
  };

  const moves = () => {
    const sortedHistory = isDescending ? history.slice().reverse() : history;
    return sortedHistory.map((step) => {
      const desc = step.stepNumber ?
          (`Go to move #${step.stepNumber} ${step.xIsNext ? "O" : "X"}(${step.lastPosition.col + 1},${step.lastPosition.row + 1})`) :
          "Go to game start";
      return (
          <li key={step.stepNumber}>
            <button className={`move${step.stepNumber === current.stepNumber ? " move--current" : ""}`}
                    onClick={() => jumpTo(step.stepNumber)}>
              {desc}
            </button>
          </li>
      );
    });
  };

  const handleChangeBoardSize = () => {
    if (boardSizeInput >= 5) {
      setBoardSize(boardSizeInput);
    } else {
      alert("Board size minimum is 5");
      setBoardSizeInput(boardSize);
    }
  };

  useEffect(() => {
    const newBoard = [];
    for (let i = 0; i < boardSize; i++) {
      const boardRow = [];
      for (let j = 0; j < boardSize; j++) {
        boardRow.push({ value: null, isHighLight: false });
      }
      newBoard.push(boardRow);
    }
    const newStepInit = {
      board: newBoard,
      stepNumber: 0,
      xIsNext: true,
      lastPosition: { row: null, col: null }
    };
    setHistory([newStepInit]);
    setCurrent(newStepInit);
    manageStatus(newStepInit);
  }, [boardSize]);

  return (
      <>
        <div className="game-size-input">
          <p className="game-size-input__label">Enter board size: </p>
          <input className="game-size-input__input" value={boardSizeInput}
                 onChange={(e) => setBoardSizeInput(e.target.value)}/>
          <button type="button" onClick={handleChangeBoardSize}>Reset
          </button>
        </div>
        <div className="game">
          <div className="game-board">
            <Board board={current.board} onClick={(r, c) => handleClick(r, c)} isPlaying={isPlaying}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div className="sort">
              <label className="switch">
                <input type="checkbox" onChange={() => setIsDescending(!isDescending)}/>
                <span className="slider round"/>
              </label>
              <p className="sort-label">Sort descending</p>
            </div>
            <ol>{moves()}</ol>
          </div>
        </div>
      </>
  );
}

export default Game;
