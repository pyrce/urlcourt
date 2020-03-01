const express = require("express");
const router = express();
const operationController = require("../controller/UrlController.js");

router.get("/ajout", operationController.ajout);
router.get("/", operationController.list);
router.get("/:page", operationController.list);
router.get("/encode/:item", operationController.encode);
router.post("/add", operationController.add);
router.get("/voir/:id", operationController.voir);
module.exports = router;
