document.getElementsByClassName("listElements")[0].children[0].children[2].addEventListener("click",(evt)=>{
    const list = document.getElementsByClassName("listElements")[0];
    evt.target.parentNode.nextElementSibling.remove();
    evt.target.parentNode.remove();
    for(let i = 0;i<list.children.length-1;i+=2){
        list.children[i].children[0].innerHTML=`${i/2+1}. `;
    }
});
document.getElementById("newEntry").addEventListener("click",()=>{
    const list = document.getElementsByClassName("listElements")[0];
    if(list.children.length>=41){
        return;
    }
    const songNum = (list.children.length-1)/2+1;
    const div = document.createElement("div");
    const num = document.createElement("span")
    num.setAttribute("class","orderedNums");
    num.innerHTML=`${songNum}. `
    const input = document.createElement("input")
    input.setAttribute("type","text");
    input.setAttribute("class","listInput");
    input.setAttribute("placeholder","a song's title");
    const close = document.createElement("div");
    close.setAttribute("class","close");
    div.appendChild(num);
    div.appendChild(input);
    div.appendChild(close);
    list.appendChild(div);
    list.appendChild(document.createElement("hr"));
    list.appendChild(document.getElementById("newEntry"))
    document.getElementsByClassName("listElements")[0].children[(songNum*2)-2].children[2].addEventListener("click",(evt)=>{
        const list = document.getElementsByClassName("listElements")[0];
        evt.target.parentNode.nextElementSibling.remove();
        evt.target.parentNode.remove();
        for(let i = 0;i<list.children.length-1;i+=2){
            list.children[i].children[0].innerHTML=`${i/2+1}. `;
        }
    });
});
document.getElementsByClassName("submit")[0].addEventListener("click",()=>{
    const songList = document.getElementsByClassName("listElements")[0].children;
    const albumTitle = document.getElementsByName("title")[0].value;
    const artist = document.getElementsByName("artist")[0].value; 
    const releaseDate = document.getElementsByName("relaseDate")[0].value; 
    const albumLength = document.getElementsByName("length")[0].value;
    const songs = [];
    for(let i = 0;i<songList.length-1;i+=2){
        if(songList[i].children[1].value === ""){
            continue;
        }
        songs.push(`${songList[i].children[0].innerHTML}${songList[i].children[1].value}`);
    }
    sessionStorage.setItem("title",albumTitle);
    sessionStorage.setItem("artist",artist);
    sessionStorage.setItem("releaseDate",releaseDate);
    sessionStorage.setItem("length",albumLength);
    sessionStorage.setItem("songList",JSON.stringify(songs));
    window.open("poster.html");
})
