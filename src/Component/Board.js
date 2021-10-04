import Square from "./Square";

export default function Board({ board, isPlaying, onClick }) {
  return (
    <div className={isPlaying ? "" : "board--disable"}>
      {board?.map((boardRow, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {boardRow.map((square, colIndex) => (
            <Square key={colIndex} square={board[rowIndex][colIndex]} onClick={() => onClick(rowIndex, colIndex)}/>
          ))}
        </div>
      ))}
    </div>
  );
}
