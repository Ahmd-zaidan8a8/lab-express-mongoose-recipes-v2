const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe.model");

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get("/", (req, res) => {
  res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", (req, res) => {
  Recipe.create({
    title: req.body.title,
    instructions: req.body.instructions,
    level: req.body.level,
    ingredients: req.body.ingredients,
    image: req.body.image,
    duration: req.body.duration,
    isArchived: req.body.isArchived,
    created: req.body.created,
  })
    .then((createdRecipe) => res.status(201).json(createdRecipe))
    .catch((err) =>
      res.status(500).json({ message: "Error while creating a new Recipe" })
    );
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get("/recipes", (req, res) => {
  Recipe.find()
    .then((recipes) => res.json(recipes))
    .catch((err) =>
      res.status(500).json({ message: "Error in Retriving the recipes " })
    );
});
//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get("/recipes/:id", (req, res) => {
  const { id } = req.params;
  Recipe.findById(id)
    .then((recipe) => res.json(recipe))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "the recipe with  the given id not Found" })
    );
});
//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put("/recipes/:id", (req, res) => {
  const { id } = req.params;
  Recipe.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedRecipe) => res.json(updatedRecipe))
    .catch((err) =>
      res.status(500).json({ message: "Error while updating a recipe" })
    );
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete("/recipes/:id", (req, res) => {
  const { id } = req.params;
  Recipe.findOneAndDelete(id)
    .then(() => res.status(204).send())
    .catch((err) =>
      res.status(500).json({ message: "Error while deleting a recipe" })
    );
});

// Start the server
app.listen(3000, () => console.log("My first app listening on port 3000!"));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
