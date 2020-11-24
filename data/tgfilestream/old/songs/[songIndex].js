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

export default function artistPage(props) {
    const router = useRouter()
    const { songIndex } = router.query

    return (
        <div style={bodyStyle}>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600&display=swap" rel="stylesheet"></link>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            <div>
                <div style={topbarStyle}>
                    <div style={topbarContentStyle}>
                        <div style={{float: "right"}}>
                            <a href="/"><i className="material-icons" style={{marginTop: "10px", marginRight: "10px", color: "black"}}>home</i></a>
                        </div>
                        <div style={{float: "left"}}>
                            <a href="#" onClick={() => {alert("Website for Telemnml, project by @MinimalMaestro\nWebsite made by Gianluca Tarantino (gianlutara@gmail.com)")}}><i className="material-icons" style={{marginTop: "10px", marginRight: "10px", color: "black"}}>info</i></a>
                        </div>
                        <div style={{marginBottom: "-10px"}}>
                            <h3>{songs[songIndex].name}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{background: "transparent", height: "10vh"}}></div>
            <br></br>
            <div style={{fontFamily: "'Montserrat', sans-serif", color: "white", overflow: "hidden"}}>
                <h4>Song's album</h4>
                <p>{songs[songIndex].albumName}</p>
                <h4>Song's Artist</h4>
                <p>{songs[songIndex].artist}</p>
                <h4>Song's Genre</h4>
                <p>{songs[songIndex].genre}</p>
                <h4>Song's Catalog</h4>
                <p>{songs[songIndex].cat}</p>
            </div>
        </div>
    )
}
export async function getStaticProps() {
    const songs = JSON.parse(fs.readFileSync("../data/songs.json"));
    
    return {
        props: {
            songs
        }
    }
}

export async function getStaticPaths() {
    return {
        paths: [
            { params: {"songIndex": "0" } }
        ],
        fallback: true
    };
}