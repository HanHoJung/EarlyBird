

// Express 기본 모듈 불러오기
var express = require('express'),
    http = require('http'),
    path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
var fs = require("fs");

// 모듈로 분리한 설정 파일 불러오기
var config = require('./config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');

// 데이터베이스 파일 불러오기
var mysql = require('mysql');
var dbconfig = require('./database/database');
var con = mysql.createConnection(dbconfig);

// 카카오 로그인
var passport = require("passport");
var express = require("express");
var KakaoStrategy = require("./lib/passport-kakao.js").Strategy;
var request = require('request');
var session = require('express-session')
var fs = require('fs');
var appKey = "";
var appSecret = "";
var accessToken_save;
var data;
var profile_d;
// passport 에 Kakao Oauth 추가
passport.use(new KakaoStrategy({
        clientID: appKey,
        clientSecret: appSecret,
        callbackURL: "http://earlybird.ml/oauth"
    },
    function(accessToken, refreshToken, params, profile, done) {
        // authorization 에 성공했을때의 액션
        console.log("accessToken :" + accessToken);
        console.log("사용자 profile: " + JSON.stringify(profile._json));
        profile_d = JSON.stringify(profile._json);
        console.log(accessToken)
        app.set('profile', profile_d);
        accessToken_save = accessToken;
        save(accessToken);
        return done(null, profile._json);
    }));
passport.serializeUser(function(user, done) {
    // console.log("serialize");
    // console.log(user)
    done(null, user);
    // console.log("---------------------------------");
});
passport.deserializeUser(function(obj, done) {
    // console.log("derialize");
    // console.log(obj)
    done(null, obj);
    // console.log("---------------------------------");

});
// 사용자 구현 부분
function save(accessToken) {



}





// express 앱 설정



// 익스프레스 객체 생성
var app = express();

app.set('trust proxy', 1) // trust first proxy
    // set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(passport.initialize());


app.get("/kakao/login", passport.authenticate('kakao', { state: "myStateValue" }));
app.get("/oauth", passport.authenticate('kakao'), function(req, res) {
    app.set("accessToken", accessToken_save);
    console.log(req.session);
    //res.send(profile_d);
    res.redirect("/check");
});


app.get("/kakao/logout", function(req, res) {

    accessToken_save = "";

    req.session.destroy(function(err) {
        // cannot access session here
        if (err) {
            console.log(err);
        }
        console.log(req.session);
        res.redirect("https://accounts.kakao.com/weblogin/account");

    })



})




//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 80);
app.set('db', con);


// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));



// 라우팅 정보를 읽어들여 라우팅 설정
route_loader.init(app, express.Router());



// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//===== 서버 시작 =====//


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

});
