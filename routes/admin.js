const express = require("express");

const adminController = require("../controller/admin");

const router = express.Router();

router.get("/products", adminController.getProducts);
router.get("/cart", adminController.getCart);
router.post("/cart/:prodId", adminController.postCart);
router.post("/create-order", adminController.postOrder);
router.get("/orders", adminController.getOrders);

module.exports = router;
