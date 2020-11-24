import Head from "next/head"
import fs from 'fs';
import { useState } from "react"

let oldError = console.error;
console.error = function() {};
let songs, currentAlbum, user = null;
let userid = "";

let bodyStyle = {
  backgroundColor: "#000000", 
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
  height: "8vh",
  position: "fixed",
  bottom: "0px",
  left: "0px",
  display: "table",
  textAlign: "center"
}

const searchBoxStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.2)", 
  borderLeft: "1px solid #5edde4", 
  borderRight: "1px solid #5edde4", 
  borderTop: "1px solid #5edde4", 
  border: "1px solid #5edde4", 
  outline: "none", 
  margin: "10px", 
  marginTop: "13px",
  float: "right",
  fontSize: "12pt", 
  color: "white", 
  borderRadius: "5px", 
  height: "30px", 
  width: "50vw",
  maxWidth: "325px"
}

function Desktop() {
  if (process.browser) {
    if (screen.width > 480) {
      //console.log("desktop")
      return true
    }
  }
  //console.log("mobile")
  return false
}

async function sendBot(messageID, genre, userid) {
  var xhr = new XMLHttpRequest();
  xhr.open( "GET", `http://134.122.103.157:1234/send/${messageID}/${genre}/${userid}`, true );
  xhr.send();
  console.log("Song has been sent to you by our bot!")
}

function sendAllEP(arrayIds, genre) {
  for (let id of arrayIds) {
    sendBot(id, genre, user["id"])
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function RenderEP(props) {
  let value = props.value;
  let genre = value.genre;
  let arrayIds = [];

  if (value.albumName != currentAlbum) {
    for (let song of songs) {
      if (song.albumName == value.albumName) {
        arrayIds.push(song.message_id);
      }
    }
    currentAlbum = value.albumName;
    return (<div style={{textAlign: "center", margin: "0 auto"}}>
      <br></br>
      <div style={{fontSize: "16px", fontWeight: "800", marginBottom: "5px"}}>
        {value.albumName.slice(0, 20)}
      </div>
      <div style={{"marginTop": "5px", "marginBottom": "5px"}}>
        {(value.hasPreview && !value.embedLink.includes(".swf")) && <iframe style={{border: "0", width: "30vh", height: "30vh"}} src={value.embedLink.replace("/artwork=small", "").replace("/tracklist=true", "")+"bgcol=222222/"} seamless><a href={value.channelLink}>{value.name}</a></iframe>}
        {((!value.hasPreview || value.embedLink.includes(".swf")) && value.hasAlbumImage) && <a target="_blank" href={value.channelLink}><img style={{width: "30vh", height: "30vh", border: "0"}} src={value.imageLink} alt={value.name}></img></a>}
      </div>
      <div style={{fontSize: "13px", fontWeight: "400", color: "#5edde4"}}>
        {(!value.hasPreview && !value.hasAlbumImage) && <>🔗 &nbsp; Link: <a href={value.channelLink} style={{color: "#5edde4", textDecoration: "none"}}>{value.channelLink}</a></>}
      </div>
      <div style={{fontSize: "13px", fontWeight: "400", color: "#5edde4"}}>
        👨‍🎨 &nbsp; Artist: {value.artist.slice(0, 20)}
      </div>
      <div style={{fontSize: "13px", fontWeight: "400", color: "#5edde4"}}>
        🎧 &nbsp; Genre: {value.genre.slice(0, 20)}
      </div>
      <div style={{fontSize: "13px", fontWeight: "400", color: "#5edde4"}}>
        👌 &nbsp; Quality: {value.quality.slice(0, 20)}
      </div>
      <div style={{fontSize: "13px", fontWeight: "400", color: "#5edde4"}}>
        🎼 &nbsp; Catalog: {value.cat.slice(0, 20)}
      </div>
      <div style={{fontSize: "13px", fontWeight: "400", color: "#5edde4"}}>
        📟 &nbsp; Download count: {value.clickCount}
      </div>
      <div style={{fontSize: "13px", fontWeight: "400"}} onClick={() => {sendAllEP(arrayIds, genre)}}>
        <a style={{color: "#f06292", textDecoration: "none"}} target="_blank" href="https://t.me/VinylNews_bot">⬇️ &nbsp; Download</a>
      </div>
      <br></br>
    </div>);
  }
  return <></>;
}

export default function Home({ data }) {
  let albumCurrent = null;
  let isLogged;
  if (process.browser) {
    isLogged = !!getCookie("user");
  }
  songs = data[0][0];
  let mbSongs = data[0][1];
  let eoSongs = data[0][2];
  let siSongs = data[0][3];
  var songNames = [];
  let currentSongLoaded = 0;
  let [songsToLoad, setMax] = useState(3);
  let [query, search] = useState("");
  let [filter, changeFilter] = useState("all");
  let currentmbSongLoaded = 0;
  let currenteoSongLoaded = 0;
  let currentsiSongLoaded = 0;
  if ((!isLogged && process.browser || (process.browser && !data[1].includes(getCookie("user")["id"]).toString())) && (!(process.browser && location.hostname == "localhost"))) {
    location.href = "/login"
  }
  if (process.browser && !(process.browser && location.hostname == "localhost")) {
    user = JSON.parse(getCookie("user"));
  }
  return (
    <div style={bodyStyle}>
        <Head>
          <title>Vinyl</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
          <script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>
        </div>
        <br></br>
        {Desktop() && <img src="/bigLogo.jpg" style={{height: "84px", margin: "5px", width: "257px", position: "absolute", left: "50%", marginLeft: "-128px", marginTop: "-15px"}}></img>}
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
        <div style={{margin: "0 auto", width: "80%", paddingLeft: "8%", marginTop: "30px"}}>
          {true && (<>
          <div style={{float: "left", width: "33%", marginLeft: "1%"}}>
            {
              mbSongs.map((value) => {
                if ((currentmbSongLoaded>songsToLoad || value.name.toLowerCase().includes("unknown") || songNames.includes(value.name) || value.link == "error")) return (<></>)
                if (!Desktop() || (!value.hasAlbumImage && !value.hasPreview)) return <></>
                //songNames.push(value.name);
                if (query) {
                  query = query.toLowerCase();
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
                    if (!value.cat.toLowerCase().includes(query)) {
                      return (<></>)
                    }
                  }
                }
                if (value.albumName != albumCurrent) {
                  currentmbSongLoaded++;
                  albumCurrent = value.albumName
                }
                return (
                  <div style={{textAlign: "start", fontFamily: "'Montserrat', sans-serif", color: "#5edde4", overflow: "hidden", fontSize: "14px", margin: "0 auto"}}>
                    <div style={{float: "left"}}>
                     <RenderEP value={value} type={"m"}></RenderEP>
                     {(false) && <div style={{marginTop: "15px"}}><a href="#" onClick={() => {sendBot(value.message_id, value.genre, user.id)}} style={{textDecoration: "none", color: "white"}}><span style={{backgroundColor: "#3B4252", borderRadius: "10px"}}>&nbsp;&nbsp;&nbsp;&nbsp;{value.name.slice(0, 15)}&nbsp;&nbsp;&nbsp;&nbsp;</span></a></div>}
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div style={{float: "left", width: "33%"}}>
          {
              eoSongs.map((value) => {
                if ((currenteoSongLoaded>songsToLoad || value.name.toLowerCase().includes("unknown") || songNames.includes(value.name) || value.link == "error")) return (<></>)
                if (!Desktop() || (!value.hasAlbumImage && !value.hasPreview)) return <></>
                //songNames.push(value.name);
                if (query) {
                  query = query.toLowerCase();
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
                    if (!value.cat.toLowerCase().includes(query)) {
                      return (<></>)
                    }
                  }
                }
                if (value.albumName != albumCurrent) {
                  currenteoSongLoaded++;
                  albumCurrent = value.albumName
                }
                return (
                  <div style={{textAlign: "start", fontFamily: "'Montserrat', sans-serif", color: "#5edde4", overflow: "hidden", fontSize: "14px", margin: "0 auto"}}>
                    <div style={{float: "left"}}>
                     <RenderEP value={value} type={"e"}></RenderEP>
                     {(false) && <div style={{marginTop: "15px"}}><a href="#" onClick={() => {sendBot(value.message_id, value.genre, user.id)}} style={{textDecoration: "none", color: "white"}}><span style={{backgroundColor: "#3B4252", borderRadius: "10px"}}>&nbsp;&nbsp;&nbsp;&nbsp;{value.name.slice(0, 15)}&nbsp;&nbsp;&nbsp;&nbsp;</span></a></div>}
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div style={{float: "left", width: "33%"}}>
          {
              siSongs.map((value) => {
                if ((currentsiSongLoaded>songsToLoad || value.name.toLowerCase().includes("unknown") || songNames.includes(value.name) || value.link == "error")) return (<></>)
                if (!Desktop() || (!value.hasAlbumImage && !value.hasPreview)) return <></>
                //songNames.push(value.name);
                if (query) {
                  query = query.toLowerCase();
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
                    if (!value.cat.toLowerCase().includes(query)) {
                      return (<></>)
                    }
                  }
                }
                if (value.albumName != albumCurrent) {
                  currentsiSongLoaded++;
                  albumCurrent = value.albumName
                }
                return (
                  <div style={{textAlign: "start", fontFamily: "'Montserrat', sans-serif", color: "#5edde4", overflow: "hidden", fontSize: "14px", margin: "0 auto"}}>
                    <div style={{float: "left"}}>
                     <RenderEP value={value} type={"s"}></RenderEP>
                     {(false) && <div style={{marginTop: "15px"}}><a href="#" onClick={() => {sendBot(value.message_id, value.genre, user.id)}} style={{textDecoration: "none", color: "white"}}><span style={{backgroundColor: "#3B4252", borderRadius: "10px"}}>&nbsp;&nbsp;&nbsp;&nbsp;{value.name.slice(0, 15)}&nbsp;&nbsp;&nbsp;&nbsp;</span></a></div>}
                    </div>
                  </div>
                )
              })
            }
          </div>
          </>)}
          {!Desktop() && <>
            {songs.map((value, index) => {
            if (currentSongLoaded>=songsToLoad || value.name.toLowerCase().includes("unknown") || songNames.includes(value.name) || value.link == "error") return (<></>)
            //songNames.push(value.name);
            if (query) {
              query = query.toLowerCase();
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
                if (!value.cat.toLowerCase().includes(query)) {
                  return (<></>)
                }
              }
            }
            currentSongLoaded += 1;
            return (
                  <div style={{textAlign: "start", fontFamily: "'Montserrat', sans-serif", color: "#5edde4", overflow: "hidden", fontSize: "14px"}}>
                    <div>
                     <RenderEP value={value}></RenderEP>
                     
                     {(false) && <div style={{marginTop: "15px"}}><a href="#" onClick={() => {sendBot(value.message_id, value.genre, user.id)}} style={{textDecoration: "none", color: "white"}}><span style={{backgroundColor: "#3B4252", borderRadius: "10px"}}>&nbsp;&nbsp;&nbsp;&nbsp;{value.name.slice(0, 15)}&nbsp;&nbsp;&nbsp;&nbsp;</span></a></div>}
                    </div>
                  </div>
            )
          })}
          </>}
          <br></br>
          <button style={{backgroundColor: "white", outline: "none", width: "100px", height: "30px", borderRadius: "10px", borderColor: "transparent", margin: "5px"}} onClick={() => {setMax(songsToLoad+3)}}>Load more</button>
          <br></br>
          <div style={{background: "transparent", height: "1vh"}}></div>
          <br></br>
        </div>
      </div>
  )
}

export async function getServerSideProps(ctx) {
  const songs = JSON.parse(fs.readFileSync("./data/songs.json"));
  const validUsers = fs.readFileSync("./data/users.txt", {encoding: "utf-8"}).split("\n");

  let mbSongs = [];
  let eoSongs = [];
  let siSongs = [];

  for (let i = 0; i < songs.length; i++) {
    if ((i < songs.length-1 && i > 0) && (songs[i]["albumName"] != songs[i+1]["albumName"]) && (songs[i]["albumName"] != songs[i-1]["albumName"])) {
      siSongs.push(songs[i])
    } 
    else if (songs[i].genre == "Minimal" || songs[i].genre == "Bandcamp") {
      mbSongs.push(songs[i]);
    } else eoSongs.push(songs[i])
  }

  return {
    props: {
      data: [
        [
          songs,
          mbSongs,
          eoSongs,
          siSongs
        ],
        validUsers
      ]
    }
  }
}


//TODO DISPLAYARE UNA SOLA CANZONE PER RIGA FAR DISPLAYARE ELECTRO OTHERS CON GLI ALTRI FACENDO 3 SONGSLOADED PER OGNI CATEGORiA
