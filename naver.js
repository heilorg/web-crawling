//COLLECTING WEBTOON PREVIEWS
let url = "http://comic.naver.com/webtoon/weekday.nhn"; //now url is naver webtoon site
let request = require("request");
let requestP = require("request-promise");
let cheerio = require("cheerio");
let fs = require("fs");
let getSrcs = require("./getSrcs.js");
let dataPath = "data.json";
let dataArr = [];
let tasksArr = [];

getSrcs();

setTimeout(async function() {
    console.log("go");
    let string = await fs.readFileSync(dataPath, "utf-8");
    let data = JSON.parse(string);
    let _i = -1; //to check if it's first src
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let src = item.src;
        let day = item.day;
        let num = item.num;
        if (_i != day) {
            console.log("Day " + day + " pipe");
            _i++;
        }
        request(src).pipe(
            fs.createWriteStream(
                __dirname + "/imgs/" + day + "_" + num + ".jpg"
            )
        );
    }
}, 4000);

let express = require("express");
let app = express();
app.listen(80);
app.use(express.static(__dirname));
//image files are saved in Directory imgs.
//and set routes for them
app.use(express.static("imgs"));

app.get("/", function(req, res) {
    console.log("someone in");
    res.sendFile(__dirname + "/index.html");
});
app.get("/renew", function(req, res) {
    fs.readdir(__dirname + "/imgs", function(err, fileArr) {
        let body = "<h1>Naver Webtoon Previews</h1>";
        for (let i = 0; i < fileArr.length; i++) {
            let day = fileArr[i].charAt(0);
            let num = fileArr[i].substr(2, 2);
            console.log(fileArr[i]);
            if (num === "00") {
                console.log("true");
                switch (day) {
                    //case 0: - unavailable
                    //case '0': - good
                    case "0":
                        body += "<h1>MON</h1>";
                        break;
                    case "1":
                        body += "<h1>TUE</h1>";
                        break;
                    case "2":
                        body += "<h1>WED</h1>";
                        break;
                    case "3":
                        body += "<h1>THU</h1>";
                        break;
                    case "4":
                        body += "<h1>FRI</h1>";
                        break;
                    case "5":
                        body += "<h1>SAT</h1>";
                        break;
                    case "6":
                        body += "<h1>SUN</h1>";
                        break;
                }
            }
            body += '<img src="';
            body += "/" + fileArr[i];
            body += '">';
        }
        fs.writeFile("index.html", body, function() {
            res.send("Sent!!");
        });
    });
});
