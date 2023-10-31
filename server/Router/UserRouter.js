import express from "express";
import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Verifytoken from "../Authentication/auth.js";

dotenv.config();

const router = express.Router();

router.get("/:_id", Verifytoken, async (req, res) => {
  try {
    const { _id } = req.params;
    const getUser = await UserModel.findById(_id);
    const { password: pass, ...rest } = getUser._doc;
    res.status(200).json({ message: "User Fetched Successfully", User: rest });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ Error: `${error.message}` });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const findbyemail = await UserModel.findOne({ email });
    if (findbyemail) {
      return res.status(500).json({ Error: "User Already Exsist" });
    }
    const findbyusername = await UserModel.findOne({ username });
    if (findbyusername) {
      return res.status(500).json({ Error: "Please Use Different username" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const adduser = await UserModel({
      username,
      password: hashpassword,
      email,
    });
    await adduser.save();
    res.status(200).json({ message: " User added Successfully " });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const finduser = await UserModel.findOne({ email });
    if (!finduser) {
      return res.status(500).json({ Error: "Please Sign up to Continue" });
    }
    const compare_passsword = await bcrypt.compare(password, finduser.password);
    if (!compare_passsword) {
      return res.status(500).json({ Error: "Invalid Password" });
    }
    const token = jwt.sign({ _id: finduser._id }, process.env.secretkey);
    //To remove password while sending it to the user
    const { password: pass, ...user_data } = finduser._doc;
    res.status(200).json({ ...user_data, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Error: `${error.message}` });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { email, name, photo } = req.body;
    const finduser = await UserModel.findOne({ email });
    if (finduser) {
      const token = jwt.sign({ _id: finduser._id }, process.env.secretkey);
      const { password: pass, ...rest } = finduser._doc;
      res.status(200).json({ ...rest, token });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(generatedPassword, salt);
      const new_user = await UserModel({
        username: name,
        password: hashpassword,
        avatar: photo,
        email,
      });
      await new_user.save();
      const token = jwt.sign({ _id: new_user._id }, process.env.secretkey);
      const { password: pass, ...rest } = new_user._doc;
      res.status(200).json({ ...rest, token });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Error: `${error.message}` });
  }
});

router.put("/updateuser/:_id", Verifytoken, async (req, res) => {
  const { username, avatar, email } = req.body;
  const { _id } = req.params;
  try {
    if (req.user._id !== _id) {
      return res
        .status(500)
        .json({ Error: "You can Update only your own account" });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const token = jwt.sign({ _id }, process.env.secretkey);

    const finduser = await UserModel.findById({ _id });

    const update_user = await UserModel.findByIdAndUpdate(
      { _id },
      {
        $set: {
          username,
          password: req.body.password ? req.body.password : finduser.password,
          email,
          avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = update_user._doc;
    res.status(200).json({
      message: "User Updated Successfully",
      data: { ...rest, token },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Error: `${error.message}` });
  }
});

router.delete("/delete/:_id", Verifytoken, async (req, res) => {
  if (req.user._id !== req.params._id) {
    return res.status(500).json({ Error: "You Can delete Your own account" });
  }
  try {
    await UserModel.findByIdAndDelete({ _id: req.params._id });
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Error: `${error.message}` });
  }
});

export { router as UserRouter };
