let timer;
let seconds = 0;
let playing = false;
let moves = 0;
let tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
let historyCount = 1;

const grid = document.getElementById("grid");
const timeDisplay = document.getElementById("time");
const btn = document.getElementById("btn-action");
const btnText = document.getElementById("btn-text");
const historyList = document.getElementById("history-list");
const popup = document.getElementById("win-popup");

function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = s % 60;
    if (m < 10) m = "0" + m;
    if (sec < 10) sec = "0" + sec;
    return m + ":" + sec;
}

function render() {
    grid.innerHTML = "";
    for (let i = 0; i < tiles.length; i++) {
        let num = tiles[i];
        let div = document.createElement("div");
        div.className = "tile";
        if (num === 0) {
            div.className += " tile-empty";
        } else {
            div.className += " tile-" + num;
            div.innerText = num;
        }
        grid.appendChild(div);
    }
}



function startGame() {
    if (playing) {
        playing = false;
        clearInterval(timer);
        btnText.innerText = "Bắt đầu";
        btn.classList.remove("btn-red");
        return;
    }
    
    playing = true;
    moves = 0;
    seconds = 0;
    timeDisplay.innerText = "00:00";
    btnText.innerText = "Kết thúc";
    btn.classList.add("btn-red");
    
    for (let i = 0; i < 100; i++) {
        let emptyInfo = tiles.indexOf(0);
        let neighbors = getNeighbors(emptyInfo);
        let random = neighbors[Math.floor(Math.random() * neighbors.length)];
        swap(emptyInfo, random);
    }
    render();

    clearInterval(timer);
    timer = setInterval(function() {
        seconds++;
        timeDisplay.innerText = formatTime(seconds);
    }, 1000);
}

function getNeighbors(idx) {
    let result = [];
    let row = Math.floor(idx / 4);
    let col = idx % 4;

    if (row > 0) result.push(idx - 4);
    if (row < 2) result.push(idx + 4);
    if (col > 0) result.push(idx - 1);
    if (col < 3) result.push(idx + 1);
    
    return result;
}

function swap(idx1, idx2) {
    let temp = tiles[idx1];
    tiles[idx1] = tiles[idx2];
    tiles[idx2] = temp;
}

function clickTile(index) {
    if (!playing) return;
    
    let emptyIdx = tiles.indexOf(0);
    let neighbors = getNeighbors(emptyIdx);
    if (neighbors.includes(index)) {
        swap(index, emptyIdx);
        moves++;
        render();
        check();
    }
}

function handleKey(e) {
    if (!playing) return;
    
    let emptyIdx = tiles.indexOf(0);
    let row = Math.floor(emptyIdx / 4);
    let col = emptyIdx % 4;
    let target = -1;

    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        if (col > 0) target = emptyIdx - 1;
    } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        if (col < 3) target = emptyIdx + 1;
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        if (row > 0) target = emptyIdx - 4;
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        if (row < 2) target = emptyIdx + 4;
    }

    if (target !== -1) {
        swap(emptyIdx, target);
        moves++;
        render();
        check();
    }
}

function check() {
    let count = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] === i + 1) {
            count++;
        }
    }
    
    if (count === 11) {
        playing = false;
        clearInterval(timer);
        popup.classList.remove("hidden");
        btnText.innerText = "Chơi lại";
        btn.classList.remove("btn-red");
        addHistory();
    }
}

function closePopup() {
    popup.classList.add("hidden");
}

function addHistory() {
    let tr = document.createElement("tr");
    tr.innerHTML = "<td>" + (historyCount++) + "</td>" +
                   "<td>" + moves + " bước</td>" +
                   "<td style='text-align: right;'>" + formatTime(seconds) + "</td>";
    historyList.prepend(tr);
}

btn.addEventListener("click", startGame);
window.addEventListener("keydown", handleKey);

render();
