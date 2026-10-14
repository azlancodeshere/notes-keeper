
import mongoose from "mongoose";
import Folder from "../models/folder.model.js";


const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const existingFolder = await Folder.findOne({
      name: name.trim(),
      user: userId,
    });

    if (existingFolder) {
      return res.status(409).json({
        success: false,
        message: "Folder already exists",
      });
    }

    const folder = await Folder.create({
      name: name.trim(),
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    console.error("Create folder error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create folder",
    });
  }
};



const getFolders = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const folders = await Folder.find({
      user: userId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: folders.length,
      folders,
    });
  } catch (error) {
    console.error("Get folders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch folders",
    });
  }
};



 const renameFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!mongoose.isValidObjectId(folderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid folder ID",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const existingFolder = await Folder.findOne({
      name: name.trim(),
      user: userId,
      _id: { $ne: folderId },
    });

    if (existingFolder) {
      return res.status(409).json({
        success: false,
        message: "A folder with this name already exists",
      });
    }

    const folder = await Folder.findOneAndUpdate(
      {
        _id: folderId,
        user: userId,
      },
      {
        $set: { name: name.trim() },
      },
      {
        returnDocument:"after",
        runValidators: true,
      }
    );

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Folder renamed successfully",
      folder,
    });
  } catch (error) {
    console.error("Rename folder error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to rename folder",
    });
  }
};



const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!mongoose.isValidObjectId(folderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid folder ID",
      });
    }

    const folder = await Folder.findOneAndDelete({
      _id: folderId,
      user: userId,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Delete folder error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete folder",
    });
  }
};


export {createFolder, getFolders, renameFolder, deleteFolder}