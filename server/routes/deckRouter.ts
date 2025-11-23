import express from "express";

import {
  createDeck,
  getDeckByUsername,
  deleteDeckById,
  updateDeckById,
  getTitleByDeckId,
} from "../controllers/deckController";

const router = express.Router();
router.post("/create", createDeck);
router.get("/get_by_username/:username", getDeckByUsername);
router.get("/get_title_by_deckId/:deckId", getTitleByDeckId);
router.delete("/delete/:deck_id", deleteDeckById);
router.put("/update/:deckId", updateDeckById);

export = router;
