import Head from "next/head"
import fs from 'fs';
import { useState } from "react"

let bodyStyle = {
  backgroundColor: "#0b173a", 
  height: "100vh", 
  width: "100vw", 
  position: "absolute", 
  top: "0", 
  left: "0",
  textAlign: "center",
  overflow: "auto",
  overflowX: "hidden"
}

const topbarStyle = {
  backgroundColor: "white", 
  borderRadius: "15px 15px 0px 0px", 
  boxShadow: "0 4px 10px 0 rgba(0,0,0,0.5)", 
  width: "100vw", 
  height: "16vh",
  position: "fixed",
  bottom: "0px",
  left: "0px",
  display: "table",
  textAlign: "center"
}

const topbarContentStyle = {
  paddingLeft: "15px", 
  fontFamily: "'Montserrat', sans-serif", 
  display: "table-cell", 
  verticalAlign: "middle"
}

const searchBoxStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.2)", 
  borderLeft: "1px solid white", 
  borderRight: "1px solid white", 
  borderTop: "1px solid white", 
  border: "1px solid white", 
  outline: "none", 
  margin: "10px", 
  fontSize: "12pt", 
  color: "white", 
  borderRadius: "5px", 
  height: "30px", 
  width: "50vw",
  maxWidth: "325px"
}

function Desktop() {
  if (process.browser) {
    return window.screen.width>=1024 ? true : false;
  }
  return true
}

async function checkFileLink(messageID, genre, name, link, index) {
  var xhr = new XMLHttpRequest();
  xhr.open( "GET", `http://localhost:1234/song/${messageID}/${genre}/${name}`, true );
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status == 404) {
        cacheSong(messageID, genre, name, link)
      }
      else {
        setSong(index)
      }
    }
  }
  xhr.send()
}

async function cacheSong(messageID, genre, name, link) {
  if (link == "") {
    alert("This song is already being downloaded");
    return
  }
  var xhr = new XMLHttpRequest();
  alert("This song isn't on our server. We are downloading the song from the Telegram server. Try to play the song later.");
  xhr.open( "GET", `http://localhost:1234/song/${messageID}/${genre}/${name}`, true );
  xhr.timeout = 350000
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.status)
      alert("Song " + name + " downloaded! Refresh the page and play it!");
      return xhr.response;
    }
  }
  xhr.ontimeout = function() {
    alert("The download of the song " + name + " is taking too long. It will continue in background, but with minor priority.")
  }
  xhr.send()
}

export default function Home({ songs }) {
  var songNames = []
  let [songsToLoad, setMax] = useState(6);
  let currentSongLoaded = 0;
  let [currentSong, setSong] = useState(null)
  let [query, search] = useState("")
  let [filter, changeFilter] = useState("all")
  return (
    <div style={bodyStyle}>
      <Head>
        <title>Vinyl</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      <div>
        <div style={topbarStyle}>
          <div style={topbarContentStyle}>
            {currentSong!=null && <div style={{float: "left"}}>
              <a href="#" onClick={() => {alert("Website for Telemnml, project by @MinimalMaestro\nWebsite made by Gianluca Tarantino (gianlutara@gmail.com)")}}><i className="material-icons" style={{marginTop: "10px", marginRight: "10px", color: "black"}}>info</i></a>
            </div>}
            {currentSong!=null && <div style={{float: "right"}}>
              <a href={"/songs/"+currentSong}><i className="material-icons" style={{marginTop: "10px", marginRight: "10px", color: "black"}}>hearing</i></a>
            </div>}
            <div style={{marginBottom: "-10px"}}>
              <h4>{currentSong >= 0 && songs[currentSong]!=undefined ? songs[currentSong].name : "No song"}</h4>
            </div>
            <audio
              style={{width: "500px", outline: "none", maxWidth: "85vw", marginBottom: "7px"}}
              controls
              src={songs[currentSong] ? songs[currentSong].link : ""}>
              Your browser does not support audio element
            </audio>
          </div>
        </div>
      </div>
      <br></br>
      <input type="search" style={searchBoxStyle} onChange={(e) => {search(e.target.value)}}></input>
      <select style={{...searchBoxStyle, width: "120px"}} id="filter" onChange={(e) => {changeFilter(e.target.value)}}>
        <option value="all">All</option>
        <option value="name">Name</option>
        <option value="album">Album</option>
        <option value="artist">Artist</option>
        <option value="genre">Genre</option>
        <option value="catalog">Catalog</option>
      </select>
      <br></br>
      <br></br>
      <div style={{margin: "0 auto", width: "50%"}}>
        {songs.map((value, index) => {
          if (currentSongLoaded>=songsToLoad || value.name.toLowerCase().includes("unknown") || songNames.includes(value.name) || value.link == "error") return (<></>)
          songNames.push(value.name);
          if (query) {
            console.log(query, filter);
            if (filter=="all") {
              if (!value.name.toLowerCase().includes(query) && !value.genre.toLowerCase().includes(query) && !value.artist.toLowerCase().includes(query) && !value.cat.toLowerCase().includes(query) && !value.albumName.toLowerCase().includes(query)) {
                return (<></>)
              }
            }
            else if (filter=="name") {
              if (!value.name.toLowerCase().includes(query)) {
                return (<></>)
              }
            }
            else if (filter=="album") {
              if (!value.albumName.toLowerCase().includes(query)) {
                return (<></>)
              }
            }
            else if (filter=="artist") {
              if (!value.artist.toLowerCase().includes(query)) {
                return (<></>)
              }
            }
            else if (filter=="genre") {
              if (!value.genre.toLowerCase().includes(query)) {
                return (<></>)
              }
            }
            else if (filter=="catalog") {
              if (!value.catalog.toLowerCase().includes(query)) {
                return (<></>)
              }
            }
          }
          currentSongLoaded += 1;
          return (
              <a href="#" onClick={() => {if (value.link=="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3" || value.link=="") {value.link = cacheSong(value.message_id, value.genre, value.name, value.link)} else {checkFileLink(value.message_id, value.genre, value.name, value.link, index)}}}>
                <div style={{textAlign: "start", fontFamily: "'Montserrat', sans-serif", color: "white", margin: "10px", marginTop: "20px", overflow: "hidden"}}>
                  <div style={{float: "left"}}>
                    <img 
                      src={value.albumImg}
                      style={{width: "3vw", height: "3vw", minHeight: "50px", minWidth: "50px", borderRadius: "50%"}}
                    />
                  </div>
                  <div style={{float: "left"}}>
                    <span style={{marginLeft: "1vw"}}>{value.name.slice(0, 15)}</span>
                    <p style={{fontSize: "12px", margin: "5px", marginLeft: "1vw"}}>
                      <span 
                        style={{backgroundColor: "orange", borderRadius: "10px"}}
                      >
                        &nbsp; {value.genre.slice(0, 15)} &nbsp;
                      </span> 
                      &nbsp; {value.artist.slice(0, 15)} • {value.albumName.slice(0, 15)}
                    </p>
                  </div>
                  <div style={{float: "right", fontSize: "12px"}}>
                    <span style={{backgroundColor: "#04d1ce", borderRadius: "9px", color: "black"}}>&nbsp;&nbsp;{value.cat.slice(0, 15)}&nbsp;&nbsp;</span>
                  </div>
                </div>
              </a>
          )
        })}
        <br></br>
        <button style={{backgroundColor: "white", outline: "none", width: "100px", height: "30px", borderRadius: "10px", borderColor: "transparent"}} onClick={() => {setMax(songsToLoad+6)}}>Load more</button>
        <br></br>
        <div style={{background: "transparent", height: "17vh"}}></div>
      </div>
    </div>
  )
}
export async function getStaticProps() {
  const songs = JSON.parse(fs.readFileSync("./data/songs.json"));

  return {
    props: {
      songs
    }
  }
}