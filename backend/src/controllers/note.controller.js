
import mongoose from "mongoose";
import {Note} from "../models/note.model.js";
import Folder from "../models/folder.model.js";


 const createNote = async (req, res) => {
  try {
    const { title, content = "", folder = null } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

   
    if (folder) {
      if (!mongoose.isValidObjectId(folder)) {
        return res.status(400).json({
          success: false,
          message: "Invalid folder ID",
        });
      }

      const existingFolder = await Folder.findOne({
        _id: folder,
        user: userId,
      });

      if (!existingFolder) {
        return res.status(404).json({
          success: false,
          message: "Folder not found",
        });
      }
    }

    const note = await Note.create({
      title: title.trim(),
      content,
      folder,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};



 const getNotes = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const filter = { user: userId };

    
    if (req.query.folder) {
      if (!mongoose.isValidObjectId(req.query.folder)) {
        return res.status(400).json({
          success: false,
          message: "Invalid folder ID",
        });
      }

      filter.folder = req.query.folder;
    }

    const notes = await Note.find(filter).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};


const getNoteById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    const note = await Note.findOne({
      _id: id,
      user: userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get note error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch note",
    });
  }
};


 const updateNote = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const { title, content, folder } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      updates.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string") {
        return res.status(400).json({
          success: false,
          message: "Content must be a string",
        });
      }

      updates.content = content;
    }

    if (folder !== undefined) {
      if (folder === null || folder === "") {
        updates.folder = null;
      } else {
        if (!mongoose.isValidObjectId(folder)) {
          return res.status(400).json({
            success: false,
            message: "Invalid folder ID",
          });
        }

        const existingFolder = await Folder.findOne({
          _id: folder,
          user: userId,
        });

        if (!existingFolder) {
          return res.status(404).json({
            success: false,
            message: "Folder not found",
          });
        }

        updates.folder = folder;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      {
        $set: updates,
      },
      {
        returnDocument:"after",
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
};



const deleteNote = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};



export {createNote, getNotes,getNoteById,updateNote,deleteNote}