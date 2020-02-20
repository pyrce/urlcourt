const controller = {};
const mongoose = require("mongoose");
const liens = require("../model/liens");
var QRCode = require("qrcode");
var url = require("url");
//Set up default mongoose connection
const {MongoClient} = require('mongodb');
var uri = "mongodb+srv://test:xSXhQSneQZkM2jr@cluster0-bjxhj.mongodb.net/liste_url?retryWrites=true&w=majority";
var ObjectId = mongoose.Types.ObjectId;
//const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
MongoClient.connect(uri, function(err, client) {
  if(err) {
       console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
  }
  console.log('Connected...');
  // perform actions on the collection object
  client.close();
});

controller.list = async (req, res) => {
  currentpage =
    typeof req.params.page != "undefined" || req.params.page > 0
      ? req.params.page
      : 0;
  //   var qr_code=await QRCode.toString(req.query.monlien);
  var qr_code = req.query.monlien;

  var perPage = 5,
    page = Math.max(0, currentpage);
  liens
    .find({})
    .limit(perPage)
    .skip(perPage * page)
    .lean()
    .exec(function(err, listes) {
      liens.countDocuments().exec(function(err, count) {
        res.render("liste", {
          data: listes,
          pages: count / perPage,
          qr_code: qr_code,
          QRCode: QRCode
        });
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

  QRCode.toDataURL(lien, function(err, qrurl) {
    res.redirect(
      url.format({
        pathname: "/",
        query: { monlien: qrurl }
      })
    );
  });
};

controller.voir = (req, res) => {
  let id = req.params.id.split("-")[1];
  liens.findOne({ _id: id }).then(lien => {
    res.redirect("http://" + lien.url);
  });
};

module.exports = controller;
