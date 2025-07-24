// backend/services/save.services.js

const SaveModel = require('../model/save.model.js');

class SaveService {

    /**
     * @description ดึงข้อมูลของ save ทั้งหมดจากฐานข้อมูล
     * @returns {Promise<Array>} Promise object represents the list of all saves.
     */
    static async getAllSaves() {
        try {
            console.log('=== DEBUG: Starting getAllSaves ===');
            
            // ตรวจสอบ connection
            console.log('Database state:', SaveModel.db.readyState);
            console.log('Collection name:', SaveModel.collection.name);
            
            // ลองใช้ countDocuments เพื่อดูว่ามี document กี่ตัว
            const count = await SaveModel.countDocuments({});
            console.log('Total documents in collection:', count);
            
            // ดึงข้อมูลทั้งหมด
            const saves = await SaveModel.find({});
            console.log('Saves fetched:', saves);
            console.log('Number of saves found:', saves.length);
            
            // ถ้าไม่มีข้อมูล ลองดึงแบบไม่ใส่ filter
            if (saves.length === 0) {
                console.log('No saves found, trying without filter...');
                const allDocs = await SaveModel.find();
                console.log('All documents:', allDocs);
            }
            
            return saves;
        } catch (error) {
            console.error('Error in getAllSaves:', error);
            throw new Error(`Could not fetch saves: ${error.message}`);
        }
    }

    /**
     * @description ดึงข้อมูล save พร้อมกับ populate ข้อมูล user และ reward
     * @returns {Promise<Array>} Promise object represents the list of all saves with populated data.
     */
    static async getAllSavesWithDetails() {
        try {
            console.log('=== DEBUG: Starting getAllSavesWithDetails ===');
            
            const saves = await SaveModel.find({})
                .populate('user_id', 'name email') // populate user data (ปรับ field ตามที่มีใน user model)
                .populate('reward_id', 'name image_url reward_points reward_desc'); // populate reward data
            
            console.log('Saves with details fetched:', saves);
            console.log('Number of saves found:', saves.length);
            
            return saves;
        } catch (error) {
            console.error('Error in getAllSavesWithDetails:', error);
            throw new Error(`Could not fetch saves with details: ${error.message}`);
        }
    }


        static async createSave(user_id, reward_id) {
    try {
        const save = new SaveModel({ user_id, reward_id });
        return await save.save();
    } catch (error) {
        throw new Error(`Cannot create save: ${error.message}`);
    }
    }

    static async findSave(user_id, reward_id) {
    try {
        return await SaveModel.findOne({ user_id, reward_id });
    } catch (error) {
        throw new Error(`Cannot find save: ${error.message}`);
    }
    }


    //ดู wishlist ของ user ที่ใช้งานอยูู่
    static async getSavedRewardsByUser(userId) {
  try {
    return await SaveModel.find({ user_id: userId }, 'reward_id');
  } catch (error) {
    throw new Error(`Failed to fetch saved rewards: ${error.message}`);
  }
}


    //เอา rewards ออกจาก wishlist
    static async deleteSave(user_id, reward_id) {
  try {
    return await SaveModel.findOneAndDelete({ user_id, reward_id });
  } catch (error) {
    throw new Error(`Cannot delete save: ${error.message}`);
  }
}





}

module.exports = SaveService;