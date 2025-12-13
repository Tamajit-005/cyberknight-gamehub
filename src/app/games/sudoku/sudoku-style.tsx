// sudoku-style.tsx

export const styles = {
  page: {
    background: "#0d1526",
    color: "white",
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
  },

  gameContainer: {
    display: "flex",
    gap: "40px",
    padding: "40px",
  },

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(9, 55px)",
    gridTemplateRows: "repeat(9, 55px)",
    gap: "4px",
    background: "#0a0f1f",
    padding: "10px",
    borderRadius: "10px",
  },

  cell: {
    width: "55px",
    height: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    background: "#132037",
    borderRadius: "6px",
    cursor: "pointer",
    userSelect: "none",
  },

  prefilled: {
    color: "#b9d4ff",
    fontWeight: "bold",
  },

  selected: {
    background: "#1f3b68",
  },

  sidebar: {
    width: "350px",
  },

  numbersButton: {
    width: "40px",
    height: "40px",
    margin: "3px",
    borderRadius: "6px",
    fontSize: "18px",
    background: "#132037",
    border: "1px solid #1f3b68",
    color: "white",
    cursor: "pointer",
  },

  actionButton: {
    margin: "5px",
    padding: "10px 18px",
    borderRadius: "6px",
    fontSize: "16px",
    background: "#1f3b68",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  message: {
    marginTop: "20px",
    opacity: 0.8,
  },
} as const;
