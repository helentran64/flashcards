import express from "express";

import {
  createFlashcard,
  getFlashcardsByDeckId,
  editFlashcardById,
  deleteFlashcardById,
} from "../controllers/flashcardController";

const router = express.Router();
router.post("/create", createFlashcard);
router.get("/get_by_deckId/:deckId", getFlashcardsByDeckId);
router.put("/update/:flashcardId", editFlashcardById);
router.delete("/delete/:flashcardId", deleteFlashcardById);

export = router;
