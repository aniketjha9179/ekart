import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user?._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2d" }
  );
};
//  REFRESS TOKEN VALIDITY ALAWAYS GREATER THAN ACCESS TOKEN
const refressToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user?._id },
    process.env.REFRESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refressToken };
};

const loginOrSignUp = async (req, res) => {
  const { phone, address } = req.body;
  try {
    // first check the user is already exist or not
    let user = await User.findOne({
      phone,
    });
    if (!user) {
      // field and value are same so we can use only one field
      user = new User({ address, phone });
      await user.save();
    } else {
      // if user is already exist then update the address
      user.address = address;
      await user.save();
    }

    // creating token for the protected route
    const { accessToken, refressToken } = generateToken(user.toObject);
    res.status(200).json({
      user,
      accessToken,
      refressToken,
    });
  } catch (error) {
    console.log("error in login or signup", error);
    res.status(500).json({ error: error.message });
  }
};


export  {loginOrSignUp};