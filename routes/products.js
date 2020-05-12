const express = require("express");
const _ = require("lodash");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const { Product, validate } = require("../models/product");

router.get("/", async (req, res) => {
  const { category } = req.query;

  let result;
  if (category.length != 0) {
    result = await Product.find({ category });
  } else {
    result = await Product.find();
  }
  const products = result.map(res => {
    return _.pick(res, [
      "_id",
      "category",
      "name",
      "price",
      "imageUrl",
      "description",
      "count",
      "total"
    ]);
  });
  res.send({ success: true, products });
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message
    });

  const product = new Product(
    _.pick(req.body, ["category", "name", "price", "imageUrl", "description"])
  );
  const result = await product.save();

  res.send({
    success: true,
    product: _.pick(result, [
      "_id",
      "category",
      "name",
      "price",
      "imageUrl",
      "description",
      "count",
      "total"
    ])
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  res.send({
    success: true,
    product: _.pick(product, [
      "_id",
      "category",
      "name",
      "price",
      "imageUrl",
      "description",
      "count",
      "total"
    ])
  });
});

module.exports = router;
