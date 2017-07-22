// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create news schema
var NewsSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  description: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the News model with the NewsSchema
var News = mongoose.model("News", NewsSchema);

// Export the model
module.exports = News;
