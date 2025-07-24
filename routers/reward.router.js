const router = require('express').Router();
const RewardController = require("../controller/reward.controller");

// ดึงรายการ reward ทั้งหมด
router.get('/rewards', RewardController.getAllRewards);

// แลกคูปอง
router.post('/redeem', RewardController.redeemReward);




module.exports = router;