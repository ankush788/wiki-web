const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


/////////////////////////////////////// mongo DB  connection ///////////////////////////////////////////////////////////////

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please check your data entry, no title specified!"]
    },
    content: {
        type: String,
        required: [true, "Please check your data entry, no content specified!"]

    }
});

const Article = mongoose.model("Article", articleSchema);   //model name is singular and collection name is plural  (Article --> articles)


///////////////////////////// get all article /////////////////////////////////////////////

app.route("/articles")

    .get(function (req, res) {



        async function getAllArticles() {
            try {
                const value = await Article.find();

                res.send(value);
            }
            catch (err) {
                res.send(err);
            }
        }
        getAllArticles();
    })

    .post(function (req, res) {


        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,

        });

        async function insertArticle() {
            try {
                const value = await newArticle.save();
                res.send(value);
            }
            catch (err) {
                res.send(err);
            }
        }
        insertArticle();
    })

    .delete(function (req, res) {

        async function deleteAllArticles() {
            try {
                const value = await Article.deleteMany();
                res.send(value);
            }
            catch (err) {
                res.send(err);
            }
        }
        deleteAllArticles();
    });

///////////////////////////// get specific article /////////////////////////////////////////////
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        async function getArticle() {
            try {
                const value = await Article.findOne({ title: req.params.articleTitle });

                if (value) {
                    res.send(value);
                }
                else {
                    res.send("nhi hai vro ");
                }

            }
            catch (err) {
                res.send(err);
            }
        }
        getArticle()
    })


    .put(function (req, res) {
        async function replaceArticle() {
            try {

                const value = await Article.findOneAndReplace({ title: req.params.articleTitle }, req.body);
                if (value) {
                    res.send("replaced sucessfully");
                }

                else {
                    res.send("nhi hai vro ");
                }


            }
            catch (err) {
                res.send(err);
            }
        }
        replaceArticle();
    })


    .patch(function (req, res) {
        async function updateArticle() {

            try {
                const value = await Article.findOneAndUpdate({ title: req.params.articleTitle }, { $set: req.body });

                if (value) {
                    res.send("updated sucessfully");
                }
                else {
                    res.send("nhi mila vro ");
                }
            }

            catch (err) {
                res.send(err);
            }

        }

        updateArticle();
    })

    .delete(function (req, res) {

        async function deleteArticle() {
            try {
                const value = await Article.findOneAndDelete({ title: req.params.articleTitle});

                if (value) {
                    res.send(value);
                }
                else {
                    res.send("nhi mila vro ");
                }
            }

            catch (err) {
                res.send(err);
            }
        }
        deleteArticle();
    });


///////////listen 
app.listen(3000, function () {
    console.log("Server started on port 3000");
});