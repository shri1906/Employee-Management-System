// import express from "express";
// import auth from "../middleware/authMiddleware.js";
// import role from "../middleware/roleMiddleware.js";
// import {
//   addLeave,
//   myLeaves,
//   getAllLeaves,
//   updateLeave,
// } from "../controllers/leaveController.js";
const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware"); 
const ctrl = require("../controllers/leaveController");

const router = express.Router();

/** USER */
router.post("/", auth, ctrl.addLeave);
router.get("/me", auth, ctrl.myLeaves);

/** ADMIN */
router.get("/", auth, role("admin"), ctrl.getAllLeaves);
router.put("/:id", auth, role("admin"), ctrl.updateLeave);

module.exports = router;