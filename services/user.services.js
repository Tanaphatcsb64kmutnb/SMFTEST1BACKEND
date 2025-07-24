const UserModel = require('../model/user.model')
const jwt = require('jsonwebtoken');

class UserService{
   static async registerUser(email, password, firstname, lastname) {
  try {
    const createUser = new UserModel({ email, password, firstname, lastname });
    return await createUser.save();
  } catch (err) {
    throw err;
  }
}


    static async checkuser(email){
        try {
            return await UserModel.findOne({email});
        } catch (error) {
            throw error;
        }
    }

static async generateToken(tokenData,secretKey,jwt_expire){
    return jwt.sign(tokenData,secretKey,{expiresIn:jwt_expire});
}

//เอา id ของ user มาใช้
static async getUserById(userId) {
  return await UserModel.findById(userId);
}

}

module.exports = UserService;