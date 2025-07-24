const SaveService = require("../services/save.services");

// ดึงรายการ save ทั้งหมด
exports.getAllSaves = async (req, res, next) => {
    try {
        const saves = await SaveService.getAllSaves();
        res.status(200).json({
            status: true,
            saves: saves
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        });
    }
}

// ดึงรายการ save ทั้งหมดพร้อมรายละเอียด user และ reward
exports.getAllSavesWithDetails = async (req, res, next) => {
    try {
        const saves = await SaveService.getAllSavesWithDetails();
        res.status(200).json({
            status: true,
            saves: saves
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        });
    }
}


// เพิ่ม function ใหม่
exports.createSave = async (req, res, next) => {
  try {
    const { user_id, reward_id } = req.body;

    // เช็คว่ามีอยู่แล้วมั้ย
    const existing = await SaveService.findSave(user_id, reward_id);
    if (existing) {
      return res.status(400).json({ status: false, message: "Already saved" });
    }

    const newSave = await SaveService.createSave(user_id, reward_id);
    res.status(201).json({
      status: true,
      message: "Save created successfully",
      data: newSave
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};



// ดึง reward_id ที่ user เคย save
exports.getSavedRewardsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const saves = await SaveService.getSavedRewardsByUser(userId);
    const rewardIds = saves.map(s => s.reward_id.toString()); // แปลง ObjectId เป็น string

    res.status(200).json({
      status: true,
      savedRewardIds: rewardIds
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
};



// Delete Save
exports.deleteSave = async (req, res, next) => {
  try {
    const { userId, rewardId } = req.params;

    const result = await SaveService.deleteSave(userId, rewardId);
    if (!result) {
      return res.status(404).json({ status: false, message: "Save not found" });
    }

    res.status(200).json({ status: true, message: "Save deleted" });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

