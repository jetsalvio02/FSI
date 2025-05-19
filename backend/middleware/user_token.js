import jwt from "jsonwebtoken";

const user_token = (req, res, next) => {
  try {
    const secret_key = "secret";
    const token = req.headers["authorization"].split(" ")[1];
    console.log("Token: ", token);
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, secret_key);
    req.user_id = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Sever error" });
  }
};

export default user_token;
