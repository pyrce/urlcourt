var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var livreSchema = Schema({
  _id: {
    type: ObjectId,
    required: true
  },
  nom: String,
  url: String
});
module.exports = mongoose.model("liens", livreSchema);
