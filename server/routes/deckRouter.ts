import express from "express";

import { createDeck, getDeckByUsername } from "../controllers/deckController";

const router = express.Router();
router.post("/create", createDeck);
router.get("/get_by_username/:username", getDeckByUsername);

export = router;
