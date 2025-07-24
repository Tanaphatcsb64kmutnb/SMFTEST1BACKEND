const UserService = require("../services/user.services");

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    const successRes = await UserService.registerUser(email, password, firstname, lastname);
    res.json({ status: true, success: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};


exports.login = async(req,res,next)=>{
    try{
        const{email,password} = req.body;
        
        const user = await UserService.checkuser(email);
        console.log(".......user.......",user);

        if(!user){
            return res.status(404).json({status:false,error:'User dont exist'});
        }
 
        const isMatch = await user.comparePassword(password);
        if(isMatch == false){
            return res.status(401).json({status:false,error:'Password Invalid'});
        }

        let tokenData = {_id:user._id,email:user.email};
        const token = await UserService.generateToken(tokenData,"secretKey",'1h');

        // Extract username from email (part before @)
        const username = user.email.split('@')[0];

        // Get user points (default to 10000 if not in database)
        const points = user.points || 10000;

        res.status(200).json({
            status: true,
            token: token,
            user: {
                _id: user._id.toString(),
                email: user.email,
                username: username,
                firstname: user.firstname,
                lastname: user.lastname,
                points: points
            }
        });
    } catch (error){
        res.status(500).json({status:false,error:error.message});
    }
}

//ดึงข้อมูล user เฉพาะคน
exports.getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    res.json({
      status: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        points: user.points,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
