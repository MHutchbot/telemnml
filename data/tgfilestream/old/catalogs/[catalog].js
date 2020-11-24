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
    const { catalog } = router.query

    let maxSongs = 0;
    let catalogArtists = [], catalogGenres = [], catalogSongs = [], catalogAlbums = [];

    for (let song in songs) {
        if (songs[song].cat.toLowerCase()==catalog.toLowerCase()) {
            catalogSongs.push(songs[song]);
            if (!catalogArtists.includes(songs[song].artist)) {
                catalogArtists.push(songs[song].artist);
            }
            if (!catalogGenres.includes(songs[song].genre)) {
                catalogGenres.push(songs[song].genre)
            }
            if (!catalogAlbums.includes(songs[song].albumName)) {
                catalogAlbums.push(songs[song].albumName)
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
                            <h3>{catalog}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{background: "transparent", height: "10vh"}}></div>
            <br></br>
            <div style={{fontFamily: "'Montserrat', sans-serif", color: "white", overflow: "hidden"}}>
                <h4>Catalog's albums</h4>
                {catalogAlbums.map((value, index) => {
                    return <p>{value}</p>
                })}
                <h4>Catalog's songs</h4>
                {catalogSongs.map((value, index) => {
                    maxSongs++;
                    if (maxSongs>=4) return (<></>)
                    return <p>{value.name}</p>
                })}
                <h4>Catalog's Genres</h4>
                {catalogGenres.map((value, index) => {
                    return <p>{value}</p>
                })}
                <h4>Catalog's Artist</h4>
                {catalogArtists.map((value, index) => {
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
            { params: { "catalog": "0" } }
        ],
        fallback: true
    };
}