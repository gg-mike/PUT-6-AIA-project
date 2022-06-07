import jwt from "jsonwebtoken";
import "dotenv/config";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, process.env.SECRET_KEY);

      req.userId = decodedData?.id;
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthenticated", unAuth: true });
  }

  next();
};

export default auth;
