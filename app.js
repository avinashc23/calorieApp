const express= require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");

const app= express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://Avinash:Avi@2302@cluster0.hbln3.mongodb.net/CalorieApp", {useNewUrlParser:true,useUnifiedTopology: true, useFindAndModify: false});

const userSchema = {
  name : String,
  bodyWeight: Number,
  bodyFat:Number,
  activityLevel:Number
}
const User= mongoose.model("User",userSchema);

app.get("/",function(req,res){
res.render("home");
})

app.post("/calculateTDEE",function(req,res){

  const user = new User({
    name : req.body.name,
    bodyWeight: req.body.weight,
    bodyFat:req.body.bodyFat,
    activityLevel:req.body.activityLevel
});

user.save();

var bodyFat=Number(req.body.bodyFat);
var bodyFatPercentage= bodyFat/100;
var bodyWeight=Number(req.body.weight);
var BMR = 21.6*(bodyWeight-(bodyFatPercentage*bodyWeight))+370;
var TDEE=BMR*(req.body.activityLevel);
var toLose2Kg= TDEE-((7000*2)/30);
var toLose4Kg=TDEE-((7000*4)/30);
var togain2Kg= TDEE+((7000*2)/30);
var togain4Kg=TDEE+((7000*4)/30);

res.render("result",{BMRvalue:BMR.toFixed(1),TDEEvalue:TDEE.toFixed(1),calToLose2Kg:toLose2Kg.toFixed(1),calToLose4Kg:toLose4Kg.toFixed(1),calToGain2Kg:togain2Kg.toFixed(1),calToGain4Kg:togain4Kg.toFixed(1)});
});

app.get("/favicon.ico", function(req, res){
    res.sendStatus(204);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
