const express = require("express");
const {
  getAllMedicines,
  getMedicineById,
  searchMedicines,
  addMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const firebaseAuthCheck = require("../middleware/firebaseAuthCheck");
const { verifyAdmin } = require("../middleware/roleCheck");

const router = express.Router();

router.use(firebaseAuthCheck);

router.get("/", getAllMedicines);
router.get("/search", searchMedicines);
router.get("/:id", getMedicineById);
router.post("/", verifyAdmin, addMedicine);
router.delete("/:id", verifyAdmin, deleteMedicine);

module.exports = router;
