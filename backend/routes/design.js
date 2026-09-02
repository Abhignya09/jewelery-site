const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createDesign,
  getMyDesigns,
  getDesignById,
  deleteDesign,
} = require("../controllers/designController");

router.post("/", auth, upload.single("sketch"), createDesign);
router.get("/", auth, getMyDesigns);
router.get("/:id", auth, getDesignById);
router.delete("/:id", auth, deleteDesign);

module.exports = router;
