import express from "express";

import { createDeck, getDeckByUsername, deleteDeckById } from "../controllers/deckController";

const router = express.Router();
router.post("/create", createDeck);
router.get("/get_by_username/:username", getDeckByUsername);
router.delete("/delete/:deck_id", deleteDeckById);

export = router;
