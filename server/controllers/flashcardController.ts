const db = require("../config/db");

import { Request, Response } from "express";

/**
 * Creates a flashcard in the database.
 */
const createFlashcard = async (req: Request, res: Response) => {
  try {
    const { deckId, term, definition, username } = req.body;
    if (!deckId || !term || !definition || !username) {
      return res.json({ success: false, message: "All fields are required" });
    }
    const data = await db.query(
      "INSERT INTO flashcard (deckId, term, definition, username) VALUES (?, ?, ?, ?)",
      [deckId, term, definition, username]
    );
    if (!data || data[0].affectedRows === 0) {
      return res.json({
        success: false,
        message: "Failed to create flashcard",
      });
    }
    return res.json({
      success: true,
      message: "Flashcard created successfully",
      data: {
        flashcardId: data[0].flashcardId,
        deckId,
        term,
        definition,
      },
    });
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/*
 * Gets the flashcards by deckId from the database.
 */
const getFlashcardsByDeckId = async (req: Request, res: Response) => {
  const deckId = req.params.deckId;
  try {
    const data = await db.query("SELECT * FROM flashcard WHERE deckId = ?", [
      deckId,
    ]);
    if (data[0].length === 0) {
      return res.json({ success: false, message: "No flashcards found" });
    }
    return res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/*
 * Edit flashcard by flashcardId
 */
const editFlashcardById = async (req: Request, res: Response) => {
  const flashcardId = req.params.flashcardId;
  const { term, definition } = req.body;
  try {
    const data = await db.query(
      "UPDATE flashcard SET term = ?, definition = ? WHERE flashcardId = ?",
      [term, definition, flashcardId]
    );
    if (data[0].affectedRows === 0) {
      return res.json({
        success: false,
        message: "Flashcard not found or no changes made",
      });
    }
    return res.json({
      success: true,
      message: "Flashcard updated successfully",
    });
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/*
 * Deletes a flashcard by flashcardId from the database.
 */
const deleteFlashcardById = async (req: Request, res: Response) => {
  const flashcardId = req.params.flashcardId;
  try {
    const data = await db.query("DELETE FROM flashcard WHERE flashcardId = ?", [
      flashcardId,
    ]);
    if (data[0].affectedRows === 0) {
      return res.json({
        success: false,
        message: "Flashcard not found or already deleted",
      });
    }
    return res.json({
      success: true,
      message: "Flashcard deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting flashcard by ID:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export { createFlashcard, getFlashcardsByDeckId, editFlashcardById, deleteFlashcardById };
