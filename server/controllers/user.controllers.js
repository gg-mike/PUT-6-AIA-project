import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import * as codes from "../server.errors.js";

import User from "../models/user.model.js";

const lessThanNow = (date) => date.getTime() < new Date(Date()).getTime();
const getDeadline = (deadline = 24) => {
  let date = new Date();
  date.setHours(date.getHours() + deadline);
  return date;
};

const sendConfirmEmail = (to, subject, text, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOptions = { from: process.env.MAIL, to, subject, text };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(503).json({ message: "Couldn't send mail", internalCode: codes.EMAIL });
    }
    return res.status(200).json({ message: `Email sent: ${info.response}` });
  });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.confirmed) return res.status(400).json({ message: "Account wasn't confirmed" });

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, { expiresIn: "2h" });

    res.status(200).json({ ...user._doc, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.SIGN_IN });
  }
};

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && lessThanNow(user.confirmationDeadline)) {
      await User.findByIdAndDelete(user._id);
    } else if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      confirmationDeadline: getDeadline(),
    });

    return sendConfirmEmail(
      email,
      "Online tournaments: Confirm email",
      `Click the link to confirm your account: http://localhost:3000/confirm-email/${result._id}`,
      res
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.SIGN_UP });
  }
};

export const confirmEmail = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    if (lessThanNow(user.confirmationDeadline))
      return res.status(404).json({ message: "User doesn't exist", canRetry: true });

    await User.findOneAndUpdate({ email: user.email }, { confirmed: true });

    res.status(200).json({ message: "Email confirmed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.CONFIRM_EMAIL });
  }
};

export const retryConfirm = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User doesn't exist", canRetry: false });

    await User.findOneAndUpdate({ email: user.email }, { confirmationDeadline: getDeadline() });

    return sendConfirmEmail(
      user.email,
      "Online tournaments: Confirm email",
      `Click the link to confirm your account: http://localhost:3000/confirm-email/${user._id}`,
      res
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.RETRY_CONFIRM });
  }
};

export const validateLink = async (req, res) => {
  let id = req.query.id;
  let hash = req.query.hash;

  if (id === undefined || hash === undefined) return res.status(400).json({ message: "Wrong link" });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    if (user.resetHash !== hash) return res.status(404).json({ message: "Wrong link" });

    if (lessThanNow(user.resetDeadline)) return res.status(404).json({ message: "Wrong link", canRetry: true });

    res.status(200).json({ message: "Correct link" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.VALIDATE_LINK });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    let hash = await bcrypt.hash(`${user.id}${Math.random() * 1000}`, 12);
    hash = hash.replaceAll("/", "_");

    await User.findOneAndUpdate({ email: user.email }, { resetHash: hash, resetDeadline: getDeadline(1) });

    return sendConfirmEmail(
      user.email,
      "Online tournaments: Reset password",
      `Click the link to confirm your account: http://localhost:3000/reset-password/${user._id}/${hash}`,
      res
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", canRetry: false, internalCode: codes.FORGOT_PASSWORD });
  }
};

export const resetPassword = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate({ email: user.email }, { password: hashedPassword, resetHash: "" });

    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", canRetry: false, internalCode: codes.RESET_PASSWORD });
  }
};
