const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLoggedIn = (req, res, next) => {
  //get token from header
   const token = getTokenFromHeader(req);
  //verify the token
 // const token = req.body;
  const decodedUser = verifyToken(token);
  if (!decodedUser) {
    throw new Error("Invalid/Expired token, please login again");
  } else {
    //save the user into req obj
    // req.userAuthId = decodedUser?.id;
    next();
  }
};
module.exports = isLoggedIn;
