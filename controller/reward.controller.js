const RewardService = require("../services/reward.services");

// ดึงรายการ reward ทั้งหมด
exports.getAllRewards = async (req, res, next) => {
    try {
        const rewards = await RewardService.getAllRewards();
        res.status(200).json({
            status: true,
            rewards: rewards
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        });
    }
}

// แลกคูปอง
exports.redeemReward = async (req, res, next) => {
    try {
        const { userId, rewardId } = req.body;
        
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!userId || !rewardId) {
            return res.status(400).json({
                status: false,
                error: 'userId and rewardId are required'
            });
        }
        
        console.log('=== CONTROLLER: Processing redeem request ===');
        console.log('Request body:', req.body);
        
        const userReward = await RewardService.redeemReward(userId, rewardId);
        
        res.status(200).json({
            status: true,
            message: "Reward redeemed successfully",
            userReward: userReward,
            newPoints: userReward.userPointsAfter // ส่งแต้มใหม่กลับไปด้วย
        });
        
    } catch (error) {
        console.error('Controller error:', error);
        
        if (error.message === 'Insufficient points') {
            res.status(400).json({
                status: false,
                error: error.message
            });
        } else if (error.message === 'User not found' || error.message === 'Reward not found') {
            res.status(404).json({
                status: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    }
}