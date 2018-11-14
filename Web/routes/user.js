

var fs = require('fs');
var bkfd2Password = require("pbkdf2-password");
var request = require('request');
var async = require("async");
var http = require('http'),
    util = require('util'),
    url = require('url');
var output={};
var main = function(req, res) {
    var LATITUDE = req.body.LATITUDE || req.body.LATITUDE;
    var LONGITUDE = req.body.LONGITUDE || req.body.LONGITUDE;
    var con = req.app.get('db');
    var geoArray = [];
    var sql = `SELECT AVG(DUST_DENSITY) as DUST_DENSITY, LATITUDE,LONGITUDE,LOCATION,DUST_STEP FROM SENSE_DATA GROUP BY LOCATION`;

    async.waterfall([
            function(callback) {
                con.query(sql, function(err, result) {
                    if (err) {
                        return err;
                    }
                    callback(null, result);

                });
            },
            function(result, callback) {

                for (i = 0; i < result.length; i++) {
                   if (Number(result[i].DUST_DENSITY) >= 0 && Number(result[i].DUST_DENSITY) <= 15) {
                        result[i].DUST_STEP = Number(0);
                    } else if (Number(result[i].DUST_DENSITY) >= 16 && Number(result[i].DUST_DENSITY) <= 35) {
                        result[i].DUST_STEP = Number(1);
                    } else if (Number(result[i].DUST_DENSITY) >= 36 && Number(result[i].DUST_DENSITY) <= 75) {
                        result[i].DUST_STEP = Number(2);
                    } else {
                        result[i].DUST_STEP = Number(3);
                    }




                    geoArray.push(new GeoObject(result[i].LOCATION, result[i].LATITUDE, result[i].LONGITUDE, Number(result[i].DUST_STEP)))
                }
                callback(null, geoArray);
            }
        ],
        function(err, result) {
            if (err) {
                return err;
            }

            output.result = geoArray;
            output.LATITUDE = LATITUDE;
            output.LONGITUDE = LONGITUDE;
            console.log(output.result);
            res.redirect("http://earlybird.ml/");

            // res.render("geo.ejs", { result: JSON.stringify(result), LATITUDE: LATITUDE, LONGITUDE: LONGITUDE });
        });
}

var main2 = function(req, res) {

    res.render("geo.ejs", { result: JSON.stringify(output.result), LATITUDE: output.LATITUDE, LONGITUDE: output.LONGITUDE });

}


var login = function(req, res) {
    console.log('/process/login  type:post');
    var con = req.app.get('db');
    var id = req.body.id || req.query.id;
    var password = req.body.password || req.query.password;


    var sql = `SELECT USER_PWD,salt FROM USER WHERE USER_ID=("${id}")`;
    var hasher = bkfd2Password();
    var opts;

    con.query(sql, function(err, result) {
        if (err) {
            return err;

        } else {
            if (result.length != 0) {
                result = JSON.stringify(result);
                result = (JSON.parse(result))[0];

                opts = {
                    password: password, //user input password
                    salt: result.salt //origin user input salt
                };

                hasher(opts, function(err, pass, salt, hash) {
                    //DB hasher사용해서 "salt, hash"저장



                    if (hash === result.USER_PWD) {
                        res.write("SUCCESS;;" + id);
                        res.end();
                    } else {
                        res.write("FAIL!");
                        res.end();
                    }

                });

            } else {
                res.write("FAIL!");
                res.end();
            }
        }
    });


}






var adduser = function(req, res) {
    console.log('/process/adduser  type:post');
    var con = req.app.get('db');

    var inputData;


    var id = req.body.id || req.query.id;
    var email = req.body.email || req.query.email;
    var name = req.body.name || req.query.name;
    var password = req.body.password || req.query.password;

    if (typeof id == "undefined" || typeof email == "undefined" || typeof name == "undefined" || typeof password == "undefined") {

        console.log("undefined value");
        res.write("FAIL");
        res.end();
    }

    console.dir("------------------------------------------------------");
    console.log(id, email, name, password);
    console.dir("------------------------------------------------------");
    var hasher = bkfd2Password();
    var opts = {
        password: password
    };

    //step1
    hasher(opts, function(err, pass, salt, hash) {
        //DB hasher사용해서 "salt, hash"저장
        password = hash;
        console.log("Connected!");
        var salt_value = salt;
        var sql = `INSERT INTO USER VALUES ("${id}","${password}","${name}","${email}","${salt_value}")`;
        console.dir(sql);
        con.query(sql, function(err, result) {
            if (err) {
                console.dir(err);
                res.write("FAIL!");
                res.end();
            } else {
                res.write("SUCCESS!");
                res.end();
            }
        });
    });
}



var kakao_send = function(req, res) {
    console.log("session")
    fs.readFile('./public/send.html', 'utf-8', function(error, data) {
        // 2.1 읽으면서 오류가 발생하면 오류의 내용을
        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('500 Internal Server Error : ' + error);
            // 2.2 아무런 오류가 없이 정상적으로 읽기가 완료되면 파일의 내용을 클라이언트에 전달
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });




}




var check = function(req, res) {
    var accessToken_save = req.app.get('accessToken');
    if (accessToken_save) {
       res.write("");
       res.end();

    } else {

       res.write("FAIL");
       res.end();
    }


}


var image = function(req, res) {
    var profile = req.app.get('profile');
    profile = JSON.parse(profile)

    var data = profile.kaccount_email + ";;" + profile.properties.profile_image + ";;" + profile.properties.nickname;
    console.dir(data);
    res.write(data);
    res.end();
}


function GeoObject(name, lat, lng, step) {
    this.name = name,
        this.lat = lat,
        this.lng = lng,
        // this.circle = L.circle([lat, lng], {
        //     color: color,
        //     fillColor: fillColor,
        //     fillOpacity: 0.5,
        //     radius: 30
        // }),
        this.step = step;
}


var test = function(req, res) {


    var con = req.app.get('db');
    var geoArray = [];

    var sql = `SELECT AVG(DUST_DENSITY) as DUST_DENSITY, LATITUDE,LONGITUDE,LOCATION,DUST_STEP FROM SENSE_DATA GROUP BY LOCATION`;


    async.waterfall([
            function(callback) {
                con.query(sql, function(err, result) {
                    if (err) {
                        return err;
                    }


                    callback(null, result);

                });
            },
            function(result, callback) {

                 for (i = 0; i < result.length; i++) {


                    geoArray.push(new GeoObject(result[i].LOCATION, result[i].LATITUDE, result[i].LONGITUDE, Number(result[i].DUST_STEP) - 1))

                }

                callback(null, geoArray);

            }

        ],
        function(err, result) {
            //GeoArray==result
            if (err) {
                return err;
            }


            res.render("geo.ejs", { result: JSON.stringify(result) });


        });



}


var step = [{
        msg: "좋음 0~15(㎍/㎥)",
        color: "skyblue",
        back_color: "#87CEEB"
    },
    {
        msg: "보통 15~35(㎍/㎥)",
        color: "grren",
        back_color: "#4ca64c"
    },
    {
        msg: "나쁨 35~75(㎍/㎥)",
        color: "yellow",
        back_color: "#e5e500"


    },
    {
        msg: "매우나쁨 75~(㎍/㎥)",
        color: "red",
        back_color: '#f03'
    }
];


var dust_info = function(req, res) {
    var con = req.app.get('db');
    var USER_ID = req.body.USER_ID || req.query.USER_ID;
    var DUST_DENSITY = req.body.DUST_DENSITY || req.query.DUST_DENSITY;
    var DUST_STEP = req.body.DUST_STEP || req.body.DUST_STEP;
    var LATITUDE = req.body.LATITUDE || req.body.LATITUDE;
    var LONGITUDE = req.body.LONGITUDE || req.body.LONGITUDE;
    var LOCATION = req.body.LOCATION || req.body.LOCATION;
    var IN_OUT = req.body.IN_OUT || req.body.IN_OUT;
    var C_TIME = c_date()




    var sql = `INSERT INTO SENSE_DATA (USER_ID,DUST_DENSITY,DUST_STEP,LATITUDE,LONGITUDE,LOCATION,C_TIME,IN_OUT) VALUES ("${USER_ID}","${DUST_DENSITY}","${DUST_STEP}","${LATITUDE}","${LONGITUDE}","${LOCATION}","${C_TIME}","${IN_OUT}")`;
    console.log(sql);
    con.query(sql, function(err, result) {
        if (err) {
            console.log("insert err");
            console.dir(err);
            res.write("FAIL!");
            res.end();
        } else {
            res.write("SUCCESS!");
            res.end();
        }
    });
}



function c_date() {
    var date = new Date();
    var year = date.getFullYear();
    var month = new String(date.getMonth() + 1);
    var day = new String(date.getDate());
    var time = date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: "numeric",
        minute: "numeric"
    });
    // 한자리수일 경우 0을 채워준다.
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day + "-" + time;
}

module.exports.main = main;
module.exports.main2 = main2;
module.exports.adduser = adduser;
module.exports.login = login;
module.exports.kakao_send = kakao_send;
module.exports.check = check;
module.exports.image = image;
module.exports.test = test;
module.exports.dust_info = dust_info;
