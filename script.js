console.log("This would be used for scripting")
let currentSong=new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/")
  let response = await a.text();
  console.log(response)
  let div=document.createElement("div")
  div.innerHTML=response;
  let anchor=div.getElementsByTagName("a")
  let songs=[]
  for (let index = 0; index < anchor.length; index++) {
    const element = anchor[index];
    if(element.href.endsWith("mp3")){
      songs.push(element.href.split("/songs/")[1])
    }
  }
  return songs;
}
const playMusic=(track, pause=false)=>{
    currentSong.src="/songs/"+track
    if(!pause){
      currentSong.play()
      play.src="./media/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}

async function main(){
  //to get the list of the songs
  let songs =await getSongs()
  console.log(songs)
  playMusic(songs[0],true)

  //to display all the songs 
  let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUL.innerHTML=songUL.innerHTML+`<li>
              <img width="30px" src="./media/music.svg"alt="music">
              <div class="info">
                <div>${song}</div>
                <div>Aditi Mane</div>
              </div>
              <div class="playNow flex">
                <div>Play Now</div>
                <img width="30px"class="invert"src="./media/play.svg">
              </div> </li>`;
  }

  //attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",element=>{
      playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    })
  });

  //attach an event listener for previous, play, next buttons
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src="./media/pause.svg"
    } else if(currentSong.play()){
      currentSong.pause();
      play.src="./media/play.svg"
    }
  })

  // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
      document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
      document.querySelector(".star").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%";
    })

  //add event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".star").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  //add an event listener for hamburger
  document.querySelector("#hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
  })

  //add an event listener for close
  document.querySelector("#close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%";
  })
  return songs
}
main()



