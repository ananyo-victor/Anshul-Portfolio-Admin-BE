import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "s0//P4$$w0rD";

const fetchuser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: "Session expired. Please log in again." });
    } else {
      return res.status(401).send({ message: "Invalid token." });
    }
  }
};

export default fetchuser;
