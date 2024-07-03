import express from "express";
import UserModel from "./login_register.schema.js";
import fetchuser from "../../middleware/fetchuser.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_EXPIRY = '1h'; // Session expiry time

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = new UserModel({ email, password, firstName, lastName });

    const validate = user.validateSync();
    if (validate) {
      return res.status(400).send({ message: validate.message });
    }

    await user.save();
    return res.status(201).send({ message: "User created" });
  } catch (error) {
    return res.status(500).send({ message: `Error creating user: ${error.message}` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !user.validatePassword(password)) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_EXPIRY });

    return res.status(200).send({ message: "User logged in successfully", token });
  } catch (error) {
    return res.status(500).send({ message: `Error logging in: ${error.message}` });
  }
});

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: `Error fetching user: ${error.message}` });
  }
});

// Logout route (optional, for any server-side cleanup)
router.post("/logout", fetchuser, (req, res) => {
  // Perform any necessary cleanup, e.g., invalidating the token
  res.status(200).send({ message: "User logged out successfully" });
});

export default router;
