import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import LoginUser from "../models/LoginUser.js";
import nodemailer from "nodemailer";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Missing fields");
  }

  const userExists = await LoginUser.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("This email has already been used. Please sign in");
  }

  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await LoginUser.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await LoginUser.findOne({ email });

  if (!user) {
    res.status(404).send("User Not Found");
    throw new Error("User not found");
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Email or password incorrect");
    throw new Error("Email or password incorrect");
  }
});

const generateToken = (id, expiresIn = "7d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await LoginUser.findOne({ email });
  if (!userExists) {
    res.status(404);
    throw new Error("Email not found. Please enter a valid email address");
  }

  if (!name && !password) {
    return;
  }

  if (!name) {
    name = userExists.name;
  }

  let hashedPassword;
  if (!password) {
    hashedPassword = userExists.password;
  } else {
    const salt = await bcrypt.genSalt(8);
    hashedPassword = await bcrypt.hash(password, salt);
  }
  await LoginUser.updateOne(
    { email: email },
    { $set: { name: name, password: hashedPassword } }
  );

  const user = await LoginUser.findOne({ email });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await LoginUser.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Email not found. Please enter a valid email address");
  }

  const token = await LoginUser.findByIdAndUpdate(
    { _id: user._id },
    { resetPasswordToken: generateToken(user._id, "30min") },
    { new: true }
  );

  const resetLink = `http://localhost:3000/resetPassword/${user.id}/${token.resetPasswordToken}`;

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Reset your password",
    html: `<p>Hello ${user.name},</p>
    
    <p>We noticed that you've requested a password reset for your Financial Application account. To reset your password, please click on the link below and follow the instructions:</p>

    <p><a href="${resetLink}">http://localhost:3000/resetPassword/${user.id}/</a></p>

    <p>If you did not request a password reset, please ignore this email. Please note that this link is only valid for 30 minutes, after which you'll need to request another password reset.</p>

    <p>If you have any questions or concerns, please do not hesitate to contact our support team.</p>

    <p>Best regards,</p>

    <p>The Financial Application Team</p>`,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log(`Password reset email sent to ${email}`);
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(`Error sending password reset email: ${error}`);
    throw new Error(`Error sending password reset email: ${error}`);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { id, token, password } = req.body;

  if (!id || !token || !password) {
    res.status(400);
    throw new Error("Missing fields");
  }

  try {
    const salt = await bcrypt.genSalt(8);
    var hashedPassword = await bcrypt.hash(password, salt);

    await LoginUser.updateOne(
      { _id: id },
      { $set: { password: hashedPassword } }
    );

    const user = await LoginUser.findOne({
      _id: id,
      resetPasswordToken: token,
    });

    if (user && !isTokenExpired(token)) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else if (isTokenExpired(token)) {
      res.status(401).json({
        status: 401,
        message: "This link has expired. Please get a new one",
      });
    } else {
      res.status(401).json({ status: 401, message: "User not found" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

const isTokenExpired = (token) => {
  const decoded = jwt.decode(token, { complete: true });
  const expirationTime = decoded.payload.exp * 1000;
  const currentTime = Date.now();
  return currentTime > expirationTime;
};
