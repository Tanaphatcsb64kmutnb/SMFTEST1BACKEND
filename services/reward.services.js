// backend/services/reward.services.js

const RewardModel = require('../model/reward.model.js');
const UserModel = require('../model/user.model.js');

class RewardService {

    /**
     * @description ดึงข้อมูลของรางวัลทั้งหมดจากฐานข้อมูล
     * @returns {Promise<Array>} Promise object represents the list of all rewards.
     */
    static async getAllRewards() {
        try {
            console.log('=== DEBUG: Starting getAllRewards ===');
            
            // ตรวจสอบ connection
            console.log('Database state:', RewardModel.db.readyState);
            console.log('Collection name:', RewardModel.collection.name);
            
            // ลองใช้ countDocuments เพื่อดูว่ามี document กี่ตัว
            const count = await RewardModel.countDocuments({});
            console.log('Total documents in collection:', count);
            
            // ดึงข้อมูลทั้งหมด
            const rewards = await RewardModel.find({});
            console.log('Rewards fetched:', rewards);
            console.log('Number of rewards found:', rewards.length);
            
            // ถ้าไม่มีข้อมูล ลองดึงแบบไม่ใส่ filter
            if (rewards.length === 0) {
                console.log('No rewards found, trying without filter...');
                const allDocs = await RewardModel.find();
                console.log('All documents:', allDocs);
            }
            
            return rewards;
        } catch (error) {
            console.error('Error in getAllRewards:', error);
            throw new Error(`Could not fetch rewards: ${error.message}`);
        }
    }

    /**
     * @description Service สำหรับการแลกของรางวัล
     * @param {string} userId - ID ของผู้ใช้
     * @param {string} rewardId - ID ของรางวัล
     * @returns {Promise<Object>} ข้อมูลการแลกรางวัล
     */
    static async redeemReward(userId, rewardId) {
        try {
            console.log(`=== REDEEM PROCESS START ===`);
            console.log(`User ${userId} attempting to redeem reward ${rewardId}`);

            // 1. ดึงข้อมูล reward
            const reward = await RewardModel.findById(rewardId);
            if (!reward) {
                throw new Error('Reward not found');
            }
            console.log(`Reward found: ${reward.name}, Points required: ${reward.reward_points}`);

            // 2. ดึงข้อมูล user
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            console.log(`User found: ${user.username || user.email}, Current points: ${user.points}`);

            // 3. ตรวจสอบแต้มเพียงพอหรือไม่
            if (user.points < reward.reward_points) {
                console.log(`Insufficient points: User has ${user.points}, needs ${reward.reward_points}`);
                throw new Error('Insufficient points');
            }

            // 4. หักแต้มและบันทึก
            const newPoints = user.points - reward.reward_points;
            user.points = newPoints;
            await user.save();

            console.log(`Points deducted successfully. New balance: ${newPoints}`);
            console.log(`=== REDEEM PROCESS COMPLETED ===`);

            // 5. สร้างข้อมูลการแลกรางวัล (อาจจะสร้าง UserReward model ในอนาคต)
            const userReward = {
                userId: userId,
                rewardId: rewardId,
                rewardName: reward.name,
                pointsUsed: reward.reward_points,
                redeemedAt: new Date(),
                userPointsAfter: newPoints
            };

            return userReward;

        } catch (error) {
            console.error('Error in redeemReward:', error);
            throw error;
        }
    }
}

module.exports = RewardService;