let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let url = "http://comic.naver.com/webtoon/weekday.nhn";

//getting img srcs from the url
function getSrc() {
    let dataArr = [];
    let dataPath = "data.json";
    request(url, async function(err, res, body) {
        let $ = cheerio.load(body);
        let lastLen = $(".col")
            .eq(6)
            .find("img").length;
        //it means the length of last one, sunday

        $(".col ").each(async function(day, item) {
            let index = 0;
            $(item)
                .find("img")
                .each(function(num, item) {
                    let src = $(item).attr("src");
                    if (src.substr(src.length - 3, 3) == "jpg") {
                        console.log(day + ", " + index);
                        let data = {
                            day: day,
                            num: getNumberInFormat(index),
                            title: "No Tiltle yet",
                            src: src
                        };
                        index++;
                        dataArr.push(data);
                    }
                    //console.log(day+' , '+num);
                    if (day == 6 && num == lastLen - 1) {
                        //this means last, should be modified
                        fs.writeFileSync(dataPath, JSON.stringify(dataArr));
                        console.log("wrote json file!");
                    }
                });
        });
    });
}

function getNumberInFormat(num) {
    let min = 0,
        max = 99;
    if (min <= num && num <= max) {
        if (0 <= num && num <= 9) {
            return "0" + num;
        } else {
            return num;
        }
    }
}

module.exports = getSrc;
