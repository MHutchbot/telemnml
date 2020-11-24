const express = require("express")
var cors = require('cors')
const { exec } = require("child_process")
const fs = require("fs")
const app = express()

app.use(cors())
try {
    fs.unlinkSync("./iscurrent")
} catch (e) {
    
}

app.get("/song/:id/:genre/:name", (req, res) => {
    const songid = req.params.id;
    const songgenre = req.params.genre;
    const name = req.params.name
    console.log("received")
    while (fs.existsSync("./iscurrent")) {

    }
    fs.writeFileSync("./command0.sh", "python3 ./get_link.py " + songgenre + " " + songid)
    console.log("started command main.py")
    exec("./command0.sh", (error, stdout, stderr) => {
        if (error) {
            if (error.signal == "SIGTERM") {
                try {
                    fs.unlinkSync("./iscurrent")
                } catch (e) {
                    
                }
            }
            console.log(`error: ${error.message}`);
            songs = JSON.parse(fs.readFileSync("songs.json"));
            let link;
	    while (!fs.existsSync("./currentLink")) {		
            }
            link = fs.readFileSync("./currentLink", "utf-8");
            fs.unlinkSync("./currentLink");
            res.status(200);
            res.send(link);
            return;
        }
        if (stderr) {
            console.log("stderror", stderr)
            res.status(401);
            res.send("error");
            songs = JSON.parse(fs.readFileSync("songs.json"));
            for (let song in songs) {
                if (songs[song].name == name) {
                    songs[song].link = "error";
                }
            }
            return;
        }
        console.log(`stdout: ${stdout}`);
        songs = JSON.parse(fs.readFileSync("songs.json"));
        let link;
        for (let song of songs) {
            if (song.name == name) {
                link = song.link;
            }
        }
	while(!fs.existsSync("./currentLink")) {}
        link = fs.readFileSync("./currentLink", "utf-8");
        fs.unlinkSync("./currentLink");
        res.status(200);
        res.send(link);
        return;
    });
})

app.get("/send/:id/:genre/:userid", (req, res) => {
    const songid = req.params.id;
    const songgenre = req.params.genre;
    const userid = req.params.userid;
    songs = JSON.parse(fs.readFileSync("songs.json"));
    for (let song of songs) {
        if (song.message_id == songid) {
            song["clickCount"] += 1;
        }
    }
    fs.writeFileSync("songs.json", JSON.stringify(songs, null, 2));
    exec("python3 ./download.py " + songid + " " + songgenre + " " + userid, (error, stdout, stderr) => {
        if (error) {
            if (error.signal == "SIGTERM") {
                try {
                    fs.unlinkSync("./iscurrent")
                } catch (e) {
                    
                }
            }
	    console.log(`error: ${error.message}`);
	    try {
            	console.log(`error: ${error.message}`);
            	res.status(400);
            	res.send("error")
            	return;
	    }
	    catch (e) {
	        console.log(e)
	    }
        }
        if (stderr) {
            console.log("stderror", stderr)
            res.status(401);
            res.send("error");
            songs = JSON.parse(fs.readFileSync("songs.json"));
            for (let song in songs) {
                if (songs[song].name == name) {
                    songs[song].link = "error";
                }
            }
            fs.writeFileSync("./songs.json", JSON.stringify(songs))
            return;
        }
        console.log(`stdout: ${stdout}`);
    })
    res.send("")
})

app.listen(1234, () => {console.log("song cacher listener listening on port 1234")})
