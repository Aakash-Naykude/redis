const Product = require("../models/products.model");
const express = require("express");
const router = express.Router();
const redis = require("../configs/redis");
router.post("/", async (req, res) => {
  try {
    const user = await Product.create(req.body);
    const users = await Product.find().lean().exec();
    redis.set("products", JSON.stringify(users));
    return res.send({ user });
  } catch (e) {
    return res.status(500).json({ status: "Failed", message: e.message });
  }
});
router.get("/", async (req, res) => {
  try {
    redis.get("products", async function (err, products) {
      console.log("products", products);
      if (err) console.log(err);
      if (products)
        return res.status(200).send({ Cashaed_forecast: JSON.parse(products) });
      const user = await Product.find().lean().exec();
      redis.set("products", JSON.stringify(user));
      return res.status(200).send(JSON.stringify(user));
    });
  } catch (e) {
    return res.status(500).json({ status: "Failed", message: e.message });
  }
});
router.get("/:id", (req, res) => {
  try {
    redis.get(`products.${req.params.id}`, async function (err, products) {
      console.log("products", products);
      if (err) console.log(err);
      if (products)
        return res.status(200).send({ Cashaed_forecast: JSON.parse(products) });
      const user = await Product.findById(req.params.id).lean().exec();
      redis.set(`products.${req.params.id}`, JSON.stringify(user));
      return res.status(200).send({ db_forcast: user });
    });
  } catch (e) {
    return res.status(500).json({ status: "Failed", message: e.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const user = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    redis.set(`products.${req.params.id}`, JSON.stringify(user));

    const users = await Product.find().lean().exec();
    redis.set("products", JSON.stringify(users));
    return res.status(200).send({ db_forcast: user });
  } catch (e) {
    return res.status(500).json({ status: "Failed", message: e.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const user = await Product.findByIdAndDelete(req.params.id);
    redis.del(`products.${req.params.id}`);

    const users = await Product.find().lean().exec();
    redis.set("products", JSON.stringify(users));
    return res.status(200).send({ db_forcast: user });
  } catch (e) {
    return res.status(500).json({ status: "Failed", message: e.message });
  }
});

module.exports = router;
