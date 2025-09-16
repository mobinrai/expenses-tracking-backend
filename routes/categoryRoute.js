import express from "express"
import { createCategory, deleteCategory, getAllCategory, getSingleCategory, updateCategory } from "../controllers/CategoryController.js"

const router = express.Router()

router.get("/", getAllCategory)

router.get("/:slug", getSingleCategory)

router.post("/", createCategory)

router.patch("/:id/delete", deleteCategory)

// router.patch("/:id/restore",restoreCagetory)

router.patch("/:id/update", updateCategory)

export default router