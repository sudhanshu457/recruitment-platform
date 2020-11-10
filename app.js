const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/recruitdb', {useNewUrlParser: true});

const questionsSchema = {
    question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String
};

const responseSchema = {
    answers: String
};
  
const Question = mongoose.model("Question", questionsSchema);

const Response = mongoose.model("Response", responseSchema);
  
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/company", function(req, res){
    res.render("companyLanding");
});

app.get("/createtest", function(req, res){
    res.render("createTest");
});

app.post("/createtest", function(req, res) {
    const ques = req.body.question;
    const opt1 = req.body.option1;
    const opt2 = req.body.option2;
    const opt3 = req.body.option3;
    const opt4 = req.body.option4;

    const item = new Question({
        question: ques,
        option1: opt1,
        option2: opt2,
        option3: opt3,
        option4: opt4,
    });

    item.save();

    res.redirect("/test");
})

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/test", function(req, res){
    Question.find({}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            res.redirect("/createtest");
        } else {
            res.render("test", {foundQuestions: foundQuestions});
        }
    });
});

app.post("/test", function(req, res){
    const len = req.body.length;
    var ans = "";
    var pref = "q";

    for(var i = 0; i < len; i++) {
        var str = pref.concat(i.toString());
        ans = ans.concat(req.body[str]);
    }

    console.log(ans);
})

app.listen(3000, function(){
    console.log("SERVER HAS STARTED!");
});