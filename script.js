document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("puzzle-container");
  const resetButton = document.getElementById("reset");
  const moveCounter = document.createElement("p");
  moveCounter.id = "move-counter";
  moveCounter.textContent = "移動回数: 0";
  document.body.insertBefore(moveCounter, container);

  const difficultySelector = document.createElement("div");
  difficultySelector.innerHTML = `
      <label>難易度選択: </label>
      <button id="easy">初級</button>
      <button id="medium">中級</button>
      <button id="hard">上級</button>
  `;
  document.body.insertBefore(difficultySelector, container);

  let gridSize = 4; // パズルのサイズ (4x4)
  let tiles = [];
  let emptyIndex = gridSize * gridSize - 1; // 空白の位置 (最初は右下)
  let moveCount = 0;

  function setDifficulty(size) {
    gridSize = size;
    container.style.width = `${size * 100}px`;
    container.style.height = `${size * 100}px`;
    init();
  }

  document.getElementById("easy").addEventListener("click", () => setDifficulty(3));
  document.getElementById("medium").addEventListener("click", () => setDifficulty(4));
  document.getElementById("hard").addEventListener("click", () => setDifficulty(5));

  function init() {
    tiles = [...Array(gridSize * gridSize - 1).keys()]
      .map((n) => n + 1)
      .concat(null);
    emptyIndex = gridSize * gridSize - 1;
    moveCount = 0;
    updateMoveCounter();
    shuffleTiles();
    render();
  }

  function shuffleTiles() {
    const directions = [-1, 1, -gridSize, gridSize]; // 左, 右, 上, 下
    for (let i = 0; i < 200; i++) {
      // 100回ランダム移動
      let possibleMoves = directions
        .map((d) => emptyIndex + d)
        .filter((newIndex) => isValidMove(emptyIndex, newIndex));
      if (possibleMoves.length === 0) continue;
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
    if (gridSize === 3) {
        if (num >= 1 && num <= 3) return "#FFDDC1"; // パステルレッド
        if (num >= 4 && num <= 6) return "#C1E1FF"; // パステルブルー
        if (num >= 7 && num <= 9) return "#C1FFC1"; // パステルグリーン
    } else if (gridSize === 4) {
        if (num >= 1 && num <= 4) return "#FFDDC1"; // パステルレッド
        if (num >= 5 && num <= 8) return "#C1E1FF"; // パステルブルー
        if (num >= 9 && num <= 12) return "#C1FFC1"; // パステルグリーン
        if (num >= 13 && num <= 15) return "#FFFFC1"; // パステルイエロー
    } else if (gridSize === 5) {
        if (num >= 1 && num <= 5) return "#FFDDC1"; // パステルレッド
        if (num >= 6 && num <= 10) return "#C1E1FF"; // パステルブルー
        if (num >= 11 && num <= 15) return "#C1FFC1"; // パステルグリーン
        if (num >= 16 && num <= 20) return "#FFFFC1"; // パステルイエロー
        if (num >= 21 && num <= 25) return "#E1C1FF"; // パステルパープル
    }
    return "white";
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
