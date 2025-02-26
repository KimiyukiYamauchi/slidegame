document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("puzzle-container");
  const resetButton = document.getElementById("reset");
  const moveCounter = document.createElement("p");
  moveCounter.id = "move-counter";
  moveCounter.textContent = "移動回数: 0";
  document.body.insertBefore(moveCounter, container);

  const gridSize = 4; // パズルのサイズ (4x4)
  let tiles = [];
  let emptyIndex = gridSize * gridSize - 1; // 空白の位置 (最初は右下)
  let moveCount = 0;

  function init() {
    tiles = [...Array(gridSize * gridSize - 1).keys()]
      .map((n) => n + 1)
      .concat(null);

    shuffleTiles();
    render();
  }

  function shuffleTiles() {
    const directions = [-1, 1, -gridSize, gridSize]; // 左, 右, 上, 下
    for (let i = 0; i < 100; i++) {
      // 100回ランダム移動
      let possibleMoves = directions
        .map((d) => emptyIndex + d)
        .filter((newIndex) => isValidMove(emptyIndex, newIndex));

      let randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [tiles[emptyIndex], tiles[randomMove]] = [
        tiles[randomMove],
        tiles[emptyIndex],
      ];
      emptyIndex = randomMove;
    }
  }

  function isValidMove(from, to) {
    if (to < 0 || to >= gridSize * gridSize) return false; // 範囲外
    const fromRow = Math.floor(from / gridSize);
    const toRow = Math.floor(to / gridSize);
    return (
      (Math.abs(from - to) === 1 && fromRow === toRow) || // 左右移動
      Math.abs(from - to) === gridSize
    ); // 上下移動
  }

  function getColor(num) {
    if (num >= 1 && num <= 4) return "#FFDDC1"; // パステルレッド
    if (num >= 5 && num <= 8) return "#C1E1FF"; // パステルブルー
    if (num >= 9 && num <= 12) return "#C1FFC1"; // パステルグリーン
    if (num >= 13 && num <= 15) return "#FFFFC1"; // パステルイエロー
    return "white"; // 空白セルの色
  }

  function render() {
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    container.innerHTML = "";
    tiles.forEach((num, index) => {
      const tile = document.createElement("div");
      tile.className = "tile";
      if (num === null) {
        tile.classList.add("empty");
        emptyIndex = index;
      } else {
        tile.textContent = num;
        tile.style.backgroundColor = getColor(num);
        tile.addEventListener("click", () => moveTile(index));
      }
      container.appendChild(tile);
    });
  }

  function moveTile(index) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
      emptyIndex = index;
      moveCount++;
      updateMoveCounter();
      render();
      checkWin();
    }
  }

  function updateMoveCounter() {
    moveCounter.textContent = `移動回数: ${moveCount}`;
}

  function checkWin() {
    if (
      tiles.slice(0, gridSize * gridSize - 1).every((num, i) => num === i + 1)
    ) {
      alert("クリアしました！");
    }
  }

  resetButton.addEventListener("click", init);

  init();
});
