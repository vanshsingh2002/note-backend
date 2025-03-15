import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Authorization: Bearer <token>"

  if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.userId = decoded.id; // Attach user ID to request object
    next(); // Proceed to next middleware or route
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authenticateUser;
