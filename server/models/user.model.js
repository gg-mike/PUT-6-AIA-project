import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmationDeadline: {
    type: Date,
    required: true,
  },
  resetHash: {
    type: String,
    default: "",
  },
  resetDeadline: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
