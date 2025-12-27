const express = require("express");
const router = express.Router();

const campaign = require("../mock/campaign.json");
const company = require("../mock/company.json");
const products = require("../mock/products.json");

router.get("/campaign", (req, res) => {
  res.json(campaign);
});

router.get("/company", (req, res) => {
  res.json(company);
});

router.get("/products", (req, res) => {
  res.json(products);
});

module.exports = router;
