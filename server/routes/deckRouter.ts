import express from "express";

import { createDeck, getDeckByUsername, deleteDeckById, updateDeckById } from "../controllers/deckController";

const router = express.Router();
router.post("/create", createDeck);
router.get("/get_by_username/:username", getDeckByUsername);
router.delete("/delete/:deck_id", deleteDeckById);
router.put("/update/:deckId", updateDeckById);

export = router;
