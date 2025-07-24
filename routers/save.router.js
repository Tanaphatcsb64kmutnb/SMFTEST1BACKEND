const router = require('express').Router();
const SaveController = require("../controller/save.controller");

// ดึงรายการ save ทั้งหมด (ข้อมูลพื้นฐาน)
router.get('/saves', SaveController.getAllSaves);

// ดึงรายการ save ทั้งหมดพร้อมรายละเอียด user และ reward
router.get('/saves/details', SaveController.getAllSavesWithDetails);


router.post('/saves', SaveController.createSave);

// GET /saves/user/:userId
router.get('/saves/user/:userId', SaveController.getSavedRewardsByUser);


//delete
router.delete('/saves/:userId/:rewardId', SaveController.deleteSave);




module.exports = router;