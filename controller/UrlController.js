const controller = {};
const mongoose = require("mongoose");
const liens = require("../model/liens");
var QRCode = require("qrcode");
var url = require("url");
//Set up default mongoose connection
const MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://test:kypUJjM6s44F6wH@cluster0-bjxhj.mongodb.net/liste_url";
var ObjectId = mongoose.Types.ObjectId;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
   client.connect();



controller.list = async (req, res) => {
 var currentpage =
    typeof req.params.page != "undefined" || req.params.page > 0
      ? req.params.page
      : 0;
  //   var qr_code=await QRCode.toString(req.query.monlien);


var monliens=client.db().collection("liens");

  var perPage = 5,
    page = Math.max(0, currentpage);
    monliens
    .find({})
    .limit(perPage)
    .skip(perPage * page).toArray().then(datas=>{

    var count=datas.length;
    //  liens.countDocuments().exec(function(err, count) {
        
        res.render("liste", {
          data: datas,
          pages: count / perPage,
        });
      });
   
};
controller.ajout = (req, res) => {
  res.render("ajout");
};
controller.add = async (req, res) => {
  var lien = new liens();
  var id = new ObjectId();
  lien._id = id;
  lien.nom = "item-" + id;
  lien.url = req.body.url;
  lien.save();
  res.redirect("/");
};

controller.encode = (req, res) => {
  let lien = "/voir/" + req.params.item;

  QRCode.toDataURL(lien, function(err, qurl) {
    res.send( qurl);
  });
};

controller.voir = (req, res) => {
  let id = req.params.id.split("-")[1];
  liens.findOne({ _id: id }).then(lien => {
    res.redirect("http://" + lien.url);
  });
};

module.exports = controller;
