const express = require("express");
const _ = require("lodash");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const { Product, validate } = require("../models/product");

router.get("/", async (req, res) => {
  let result = await Product.find().select("-__v");
  res.send({ success: true, products: result });
});

router.get("/search", async (req, res) => {
  const { query } = req.query;

  const result = await Product.find().select("-__v");
  let products = [];
  if (query.indexOf(" ") === -1) {
    products = result.filter(
      (p) =>
        p.name.toLowerCase().split(" ").includes(query) ||
        p.description.toLowerCase().split(" ").includes(query)
    );
  } else {
    products = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  res.send({ success: true, products });
});

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  let product = await Product.find({ _id: productId }).select("-__v");
  if (product) {
    res.send({
      success: true,
      product,
    });
  } else {
    res.send({
      success: true,
      message: "No product Found",
    });
  }
});

router.post("/", [auth, admin], async (req, res) => {
  if (req.files === null) {
    return res
      .status(400)
      .json({ success: false, message: "No image selected" });
  }

  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });

  const { name, price, category, description } = req.body;

  const file = req.files.file;

  file.mv(`${__dirname}/public/uploads/${file.name}`);

  const product = new Product({
    name,
    price,
    category,
    description,
    imageUrl: file.name,
  });
  const result = await product.save();

  res.send({
    success: true,
    result,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (product) {
    res.send({
      success: true,
      product: _.pick(product, [
        "_id",
        "tags",
        "name",
        "price",
        "imageUrl",
        "description",
        "count",
        "total",
      ]),
    });
  } else {
    res.send({
      success: true,
      message: "No product Found",
    });
  }
});

module.exports = router;
