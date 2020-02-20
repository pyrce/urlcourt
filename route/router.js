const express = require("express");
const router = express();
const operationController = require("../controller/UrlController.js");

router.get("https://urlcourt.herokuapp.com/", operationController.list);
router.get("/ajout", operationController.ajout);
router.get("/encode/:item", operationController.encode);
router.post("/add", operationController.add);
router.get("voir/:id", operationController.voir);
module.exports = router;
