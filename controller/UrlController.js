const controller = {};
const mongoose = require("mongoose");
const liens = require("../model/liens");
var QRCode = require("qrcode");
var url = require("url");
//Set up default mongoose connection
const MongoClient = require('mongodb').MongoClient;

var ObjectId = mongoose.Types.ObjectId;
var base=typeof process.env.MONGODB_URI!="undefined" ?process.env.MONGODB_URI :"mongodb://localhost:27017/liste_url";
/*const client = new MongoClient(base, { useNewUrlParser: true,useUnifiedTopology: true  });
   client.connect();*/
mongoose.connect(base,{ useNewUrlParser: true,useUnifiedTopology: true  });
controller.list =  (req, res) => {
 var currentpage =
    typeof req.params.page != "undefined" || req.params.page > 0
      ? req.params.page
      : 0;
  //   var qr_code=await QRCode.toString(req.query.monlien);


//var monliens=client.db().collection("liens");

  var perPage = 5,
    page = Math.max(0, currentpage);
    liens
    .find({})
    .limit(perPage)
    .skip(perPage * page).then(datas=>{

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

controller.voir =  (req, res) => {
  let id = req.params.id.split("-")[1];

 liens.findOne({ _id: id }).then(lien=> {
    res.redirect("http://"+lien.url);
 });


};

module.exports = controller;
