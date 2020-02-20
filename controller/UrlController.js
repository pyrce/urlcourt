const controller = {};
const mongoose = require("mongoose");
const liens = require("../model/liens");
var QRCode = require("qrcode");
var url = require("url");
//Set up default mongoose connection
var mongoDB = "mongodb://localhost:27017/liste_url";
var ObjectId = mongoose.Types.ObjectId;
mongoose.connect(mongoDB, {
  useNewUrlParser: true
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
  let lien = "192.168.3.88/voir/" + req.params.item;

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
