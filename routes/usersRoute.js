const router = require("express").Router();
const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Otps = require("../models/Otp");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// register new user

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send({
        message: "User already exists",
        success: false,
        data: null,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      message: "User created successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
      return res.send({
        message: "User does not exist",
        success: false,
        data: null,
      });
    }

    if (userExists.isBlocked) {
      return res.send({
        message: "Your account is blocked , please contact admin",
        success: false,
        data: null,
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );

    if (!passwordMatch) {
      return res.send({
        message: "Incorrect password",
        success: false,
        data: null,
      });
    }

    const token = jwt.sign({ userId: userExists._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});
router.post("/sendOTP", async (req, res) => {
  try {
    const PhoneNumber = req.body.PhoneNumber
    let OTP = Math.floor(1000 + Math.random() * 9000)
    console.log(OTP, " - ", PhoneNumber);
    client.messages
      .create({
        body: `Verification by Vatsa-, OTP-${OTP}`,
        from: "+13613457860",
        to: `+918660956885`
      })
      .then(async (message) => {
        const saveOTP = new Otps({ code: OTP, phone: PhoneNumber })
        await saveOTP.save()

        res.status(200).send("OTP has been sent")
      })
      .catch(err => {
        res.status(304).send("Server Error in seneding otp");
      });
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});
router.post("/loginOTP", async (req, res) => {
  try {
    const check = await Otps.findOne({ code: req.body.OTP })
    if (!check) return res.send("Wrong OTP");
    if (check) {
      //getting data of user
      // const user = await Users.findOne({ phno: check.phone });
      // if (!user) return res.send("User not found");
      const userExists = await User.findOne({ phno: check.phone });
      if (!userExists) {
        return res.send({
          message: "User does not exist",
          success: false,
          data: null,
        });
      }

      if (userExists.isBlocked) {
        return res.send({
          message: "Your account is blocked , please contact admin",
          success: false,
          data: null,
        });
      }

     



      const token = jwt.sign({ userId: userExists._id }, process.env.jwt_secret, {
        expiresIn: "1d",
      });

      res.send({
        message: "User logged in successfully",
        success: true,
        data: token,
      });


      await Otps.findByIdAndDelete(check._id);
    }
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});
// get user by id

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// get all users
router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// update user

router.post("/update-user-permissions", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      message: "User permissions updated successfully",
      success: true,
      data: null,
    });
  } catch {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

module.exports = router;
