const boomCount = 35;
document.getElementsByClassName("boomCount")[0].innerHTML = boomCount;
const boardWidth = 15;
const boardHeight = 20;
const tileCount = boardWidth * boardHeight;
const recuredCoords = [];

let flagMode = false;
const board = document.getElementById("board");
for(let i = 0;i<tileCount;i++){
    board.innerHTML+=`<div data-Y="${Math.floor(i/boardWidth)}" data-X="${i%boardWidth}" class="tile"></div>`;
}




const boomArray = genBoom(boomCount);
genNums();

document.getElementsByClassName("menu-toggle")[0].addEventListener("click",()=>{
    document.getElementsByClassName("menu-container")[0].classList.toggle("menu-hidden");
    document.getElementsByClassName("menu-close")[0].classList.toggle("menu-hidden");
});
document.getElementsByClassName("menu-close")[0].addEventListener("click",()=>{
    document.getElementsByClassName("menu-close")[0].classList.toggle("menu-hidden");
    document.getElementsByClassName("menu-container")[0].classList.toggle("menu-hidden");
});

document.getElementsByClassName("flag")[0].addEventListener("click",()=>{
    document.getElementsByClassName("flag")[0].classList.toggle("menu-boom-flag");
    flagMode = !flagMode;
});

board.addEventListener("click", (event)=>{
    const tile = event.target;
    const Y = parseInt(tile.getAttribute("data-Y")); 
    const X = parseInt(tile.getAttribute("data-X"));
    if(tile.id==="board" || tile.classList==""){
        return;
    }
    if(flagMode){
        if(boomCount - document.getElementsByClassName("flagBoom").length<=0){
            if(tile.classList.contains("flagBoom")){
                tile.classList.toggle("flagBoom");
                document.getElementsByClassName("boomCount")[0].innerHTML = boomCount - document.getElementsByClassName("flagBoom").length;
            }
            return;
        }
        if(tile.classList.contains("shown")){
            return;
        }
        tile.classList.toggle("flagBoom");
        document.getElementsByClassName("boomCount")[0].innerHTML = boomCount - document.getElementsByClassName("flagBoom").length;
        const hasWon = checkWin(); 
        if(hasWon===true){
            seeBoom();
            winMenuToggle(hasWon);
        }
        return;
    }
    if(tile.classList.contains("flagBoom")){
        return;
    }
    if(boomArray[X][Y]===-1){
        tile.classList.add("boom");
        seeBoom();
        winMenuToggle(false);
    }
    else if(boomArray[X][Y]===0){
        tile.classList.add("shown");
        tile.innerHTML = " ";
        revealAround(tile);
    }
    else{
        tile.classList.add("shown");
        tile.innerHTML = `<b>${boomArray[X][Y]}</b>`;
        tile.classList.add(`color${boomArray[X][Y]}`);
        revealAround(tile);
    }
});

function winMenuToggle(win){
    const menuContainer = document.getElementsByClassName("menu-container")[0];
    const menuHeader = document.getElementsByClassName("menu-header")[0];
    document.getElementsByClassName("menu-close")[0].classList.toggle("menu-hidden");
    if(win === true){
        menuContainer.classList.toggle("menu-hidden");
        menuHeader.innerHTML = "You Won!!!";
    }
    else if(win === false){
        menuContainer.classList.toggle("menu-hidden");
        menuHeader.innerHTML = "You Lost";
    }
}

function checkWin(){
    let boomFlaged = 0;
    const boomTiles = document.getElementsByClassName("flagBoom");
    for(let i = 0;i<boomTiles.length;i++){
        boomFlaged+=1;    
        const Y = parseInt(boomTiles[i].getAttribute("data-Y")); 
        const X = parseInt(boomTiles[i].getAttribute("data-X"));
        if(boomArray[X][Y]!==-1){
            return false;       
        }
    }
    if(boomFlaged===boomCount){
        return true;
    }
};

function revealAround(tile){
    const Y = parseInt(tile.getAttribute("data-Y")); 
    const X = parseInt(tile.getAttribute("data-X"));
    if(boomArray[X][Y]!==0){
        tile.classList.add("shown");
        tile.innerHTML = `<b>${boomArray[X][Y]}</b>`;
        tile.classList.add(`color${boomArray[X][Y]}`);
        return;
    }
    for(let neighbourY = -1;neighbourY<2;neighbourY++){
        if(Y+neighbourY<0 || Y+neighbourY>=boardHeight){
            continue;
        }
        for(let neighbourX = -1;neighbourX<2;neighbourX++){
            if(neighbourX===0 && neighbourY===0){
                continue;
            }
            if(X+neighbourX<0 || (X+neighbourX)>=boardWidth){
                continue;
            }
            if(board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].classList.contains("flagBoom")){
                continue;
            }
            if(neighbourX !== 0 && neighbourY===0){
                if(boomArray[X+neighbourX][Y+neighbourY]===0 && !recuredCoords.includes((Y+neighbourY)*boardWidth+(X+neighbourX))){
                    board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].classList.add("shown");
                    board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].innerHTML = " ";
                    recuredCoords.push(Y*boardWidth+X);
                    revealAround(board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)]);
                }
            }
            if(neighbourY !== 0 && neighbourX===0){
                if(boomArray[X+neighbourX][Y+neighbourY]===0 && !recuredCoords.includes((Y+neighbourY)*boardWidth+(X+neighbourX))){
                    board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].classList.add("shown");
                    board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].innerHTML = " ";
                    recuredCoords.push(Y*boardWidth+X);
                    revealAround(board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)]);
                }
            }
            if(boomArray[X+neighbourX][Y+neighbourY]!==0){
                board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].classList.add("shown");
                board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].innerHTML = `<b>${boomArray[X+neighbourX][Y+neighbourY]}</b>`;
                board.children[(Y+neighbourY)*boardWidth+(X+neighbourX)].classList.add(`color${boomArray[X+neighbourX][Y+neighbourY]}`);
            }
        }
    }
}

function genBoom(bombCount){
    const boomArray = [];

    for(let i = 0;i<boardWidth;i++){
        boomArray[i] = []
        for(let j = 0;j < boardHeight;j++){
            boomArray[i].push(0);
        }
    }


    let bombCounter = bombCount;

    while(bombCounter > 0){
        const randAdress = [Math.floor(Math.random() * (boardWidth-0.001)),Math.floor(Math.random() * (boardHeight-0.001))];//-0.001 is index otb prevention
        if(boomArray[randAdress[0]][randAdress[1]]!==-1){
            boomArray[randAdress[0]][randAdress[1]]=-1;
            bombCounter-=1;
        }
    }
    return boomArray;
};

function genNums(){
    for(let i = 0;i<tileCount;i++){
        const Y = Math.floor(i/boardWidth);
        const X = i%boardWidth;
        let neighbourBombCount = 0;
        if(boomArray[X][Y]===-1){
            continue;
        }
        for(let neighbourY = -1;neighbourY<2;neighbourY++){
            if(Y+neighbourY<0 || Y+neighbourY>=boardHeight){
                continue;
            }
            for(let neighbourX = -1;neighbourX<2;neighbourX++){
                if(neighbourX===0 && neighbourY===0){
                    continue;
                }
                if(X+neighbourX<0 || (X+neighbourX)>=boardWidth){
                    continue;
                }
                if(boomArray[X+neighbourX][Y+neighbourY]===-1){
                    neighbourBombCount+=1;
                }
            }
        }
        boomArray[X][Y]=neighbourBombCount;
    }
}


function seeBoom(){
    for(let i = 0;i<board.children.length;i++){
        const tile = board.children[i];
        const Y = parseInt(tile.getAttribute("data-Y")); 
        const X = parseInt(tile.getAttribute("data-X"));

        if(tile.id!=="board"){
            if(boomArray[X][Y]===-1){
                tile.classList.add("flagBoom");
            }
            else if(boomArray[X][Y]===0){
                tile.classList.add("shown");
                tile.innerHTML = " ";
            }
            else{
                tile.classList.add("shown");
                tile.innerHTML = `<b>${boomArray[X][Y]}</b>`;
                tile.classList.add(`color${boomArray[X][Y]}`);
            }
        }
    }
}

