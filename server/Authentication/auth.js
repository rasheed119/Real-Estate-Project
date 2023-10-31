import jwt from "jsonwebtoken";

export default async function Verifytoken(req, res, next) {
  try {
    const token = req.headers["access_token"];
    if (!token) {
      return res.status(500).json({ Error: "Invalid Authoraisation" });
    }
    jwt.verify(token, process.env.secretkey, (err, user) => {
      if (err) {
        new Error(err.message);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ Error: `${error.message}` });
  }
}
