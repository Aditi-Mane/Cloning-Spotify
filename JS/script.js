console.log("This would be used for scripting")
let currentSong = new Audio();
let currentFolder;

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

async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${currentFolder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < anchor.length; index++) {
    const element = anchor[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${currentFolder}/`)[1])
    }
  }
  //to display all the songs 
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  songUL.innerHTML="";
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
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
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    })
  });
}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track
  if (!pause) {
    currentSong.play()
    play.src = "./media/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:3000/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML=response;
  let anchors=document.getElementsByTagName("a")
  Array.from(anchors).forEach(e=>{
    if(e.href.startsWith("/songs"))
  })

  
}
async function main() {
  //to get the list of the songs
  await getSongs("songs/ncs")
  playMusic(songs[0], true)

  //Display all the albums on the page
  displayAlbums()

  //attach an event listener for previous, play, next buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./media/pause.svg"
    } else if (currentSong.play()) {
      currentSong.pause();
      play.src = "./media/play.svg"
    }
  })

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".star").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  //add event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".star").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  //add an event listener for hamburger
  document.querySelector("#hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  })

  //add an event listener for close
  document.querySelector("#close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  })

  document.querySelector("#previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      alert("No previous song available.");
    }
  });


  //add an event listener for next
  document.querySelector("#next").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop())
    if (index !== -1 && index < songs.length - 1) {
      playMusic(songs[index + 1]);
    } else {
      alert("No next song available.");
    }
  })

  //add an event listener for volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
    console.log("Setting volume to: ", e.target.value)
    if (currentSong.volume == 0) {
      document.querySelector(".volume").getElementsByTagName("img")[0].src = "./media/mute.svg"
    } else {
      document.querySelector(".volume").getElementsByTagName("img")[0].src = "./media/volume.svg"
    }
  })

  //load the playlist whenever the card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      let songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    })
  })

  return songs
}
main()



