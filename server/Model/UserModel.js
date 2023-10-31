import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requiired: true,
      unique: true,
    },
    email: {
      type: String,
      requiired: true,
      unique: true,
    },
    password: {
      type: String,
      requiired: true,
    },
    avatar : {
      type : String,
      default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
