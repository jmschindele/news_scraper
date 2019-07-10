const mongoose = require('mongoose');

// Save a reference to the schema constructor

const Schema = mongoose.Schema;

//Create a new userSchema object

const ArticleSchema = new Schema({
    Headline: {
        type: String,
        required: true
    },

    URL: {
        type: String,
        required: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

//create a model from the schema
const Article = mongoose.model("Article", ArticleSchema);

//export article model
module.exports = Article;