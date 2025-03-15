import express from "express";
import Note from "../models/note.js"; 
import authenticateUser from "../middleware/authMiddleware.js"; 

const router = express.Router();

// ✅ Create a New Note
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ userId: req.userId, title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// ✅ Get All Notes for the Logged-in User
router.get("/", authenticateUser, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve notes" });
  }
});

// ✅ Update a Note
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Ensure the note belongs to the user
      { title: req.body.title, content: req.body.content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ✅ Delete a Note
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
