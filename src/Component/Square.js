export default function Square({ square, onClick }) {
  return (
    <button className={`square${square.isHighLight ? " square--highlight" : ""}`} onClick={() => onClick()}>
      {square.value}
    </button>
  );
}