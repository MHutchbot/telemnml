import { useRouter } from 'next/router'
import fs from 'fs';

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
    borderRadius: "0px 0px 15px 15px", 
    boxShadow: "0 4px 10px 0 rgba(0,0,0,0.5)", 
    width: "100vw", 
    height: "10vh",
    position: "fixed",
    top: "0px",
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

export default function artistPage({ songs }) {
    const router = useRouter()
    const { artist } = router.query

    let maxSongs = 0;
    let artistCatalog = [], artistGenres = [], artistSongs = [], artistAlbums = [];

    for (let song in songs) {
        if (songs[song].artist.toLowerCase()==artist.toLowerCase()) {
            artistSongs.push(songs[song]);
            if (!artistCatalog.includes(songs[song].cat)) {
                artistCatalog.push(songs[song].cat);
            }
            if (!artistGenres.includes(songs[song].genre)) {
                artistGenres.push(songs[song].genre)
            }
            if (!artistAlbums.includes(songs[song].albumName)) {
                artistAlbums.push(songs[song].albumName)
            }
        }
    }
    return (
        <div style={bodyStyle}>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600&display=swap" rel="stylesheet"></link>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            <div>
                <div style={topbarStyle}>
                    <div style={topbarContentStyle}>
                        <div style={{marginBottom: "-10px"}}>
                            <h3>{artist}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{background: "transparent", height: "10vh"}}></div>
            <br></br>
            <div style={{fontFamily: "'Montserrat', sans-serif", color: "white", overflow: "hidden"}}>
                <h4>Artist's albums</h4>
                {artistAlbums.map((value, index) => {
                    return <p>{value}</p>
                })}
                <h4>Artist's songs</h4>
                {artistSongs.map((value, index) => {
                    maxSongs++;
                    if (maxSongs>=4) return (<></>)
                    return <p>{value.name}</p>
                })}
                <h4>Artist's Genres</h4>
                {artistGenres.map((value, index) => {
                    return <p>{value}</p>
                })}
                <h4>Artist's Catalogs</h4>
                {artistCatalog.map((value, index) => {
                    return <p>{value}</p>
                })}
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
export async function getStaticPaths() {
    return {
        paths: [
            { params: { "artist": "0" } }
        ],
        fallback: true
    };
}