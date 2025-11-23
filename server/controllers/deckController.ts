const db = require("../config/db");

import { Request, Response } from "express";

/**
 * Creates a deck in the database.
 *
 */
const createDeck = async (req: Request, res: Response) => {
  try {
    const { username, title, isPrivate } = req.body;
    if (!username || !title || isPrivate === "") {
      return res.json({ success: false, message: "All fields are required" });
    }
    const date = new Date();
    const data = await db.query(
      "INSERT INTO deck (username, title, privacy, creation) VALUES (?, ?, ?, ?)",
      [username, title, isPrivate, date]
    );
    if (!data || data[0].affectedRows === 0) {
      return res.json({ success: false, message: "Failed to create deck" });
    }
    return res.json({
      success: true,
      message: "User created successfully",
      data: {
        deckId: data[0].deck_id,
        username,
        title,
        isPrivate,
        date,
      },
    });
  } catch (error) {
    console.error("Error creating deck:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/*
 * Gets the decks for a specific user from the database.
 */
const getDeckByUsername = async (req: Request, res: Response) => {
  const username = req.params.username;
  try {
    const data = await db.query("SELECT * FROM deck WHERE username = ?", [
      username,
    ]);
    if (data[0].length === 0) {
      return res.json({ success: false, message: "Deck not found" });
    }
    // Normalize privacy column to a boolean
    const rows = data[0].map((row: any) => {
      const privacyVal = row.privacy;
      let privacyBoolean = false;
      try {
        if (Buffer.isBuffer(privacyVal)) {
          privacyBoolean = privacyVal[0] === 1;
        } else if (typeof privacyVal === "number") {
          privacyBoolean = privacyVal === 1;
        } else {
          privacyBoolean = !!privacyVal;
        }
      } catch (e) {
        privacyBoolean = !!privacyVal;
      }

      return {
        ...row,
        privacy: privacyBoolean,
      };
    });

    return res.json({ success: true, message: "Deck found", data: rows });
  } catch (error) {
    console.error("Error fetching deck by username:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/* 
* Gets the title of a deck by deckId from the database.
*/
const getTitleByDeckId = async (req: Request, res: Response) => {
  const deckId = req.params.deckId;
  try {
    const data = await db.query("SELECT title FROM deck WHERE deckId = ?", [
      deckId,
    ]);
    if (data[0].length === 0) {
      return res.json({ success: false, message: "Deck not found" });
    }
    return res.json({
      success: true,
      message: "Deck title found",
      data: {
        title: data[0][0].title,
      },
    });
  } catch (error) {
    console.error("Error fetching deck title by ID:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/*
 * Deletes a deck by deckid from the database.
 */
const deleteDeckById = async (req: Request, res: Response) => {
  const deckId = req.params.deck_id;
  try {
    const data = await db.query("DELETE FROM deck WHERE deckId = ?", [deckId]);
    if (data[0].affectedRows === 0) {
      return res.json({
        success: false,
        message: "Deck not found or already deleted",
      });
    }
    return res.json({ success: true, message: "Deck deleted successfully" });
  } catch (error) {
    console.error("Error deleting deck by ID:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/*
 * Updates a deck by deckId in the database.
 */
const updateDeckById = async (req: Request, res: Response) => {
  const deckId = req.params.deckId;
  const { title, isPrivate } = req.body;
  try {
    const data = await db.query(
      "UPDATE deck SET title = ?, privacy = ? WHERE deckId = ?",
      [title, isPrivate, deckId]
    );
    if (data[0].affectedRows === 0) {
      return res.json({
        success: false,
        message: "Deck not found or no changes made",
      });
    }
    return res.json({ success: true, message: "Deck updated successfully" });
  } catch (error) {
    console.error("Error updating deck by ID:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export { createDeck, getDeckByUsername, deleteDeckById, updateDeckById, getTitleByDeckId };
