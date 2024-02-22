//App Errpr
const appErr = (message, statusCode) => {
    let error = new Error(message);
    error.statusCode = statusCode ? statusCode : 500;
 if(process.env.NODE_MODE === "DEVELOPMENT"){
    error.stack = error?.stack;
 }
    error.message = error?.message;
    return error;
  };
  // 
  //Err class
  class AppErr extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = "failed";
      this.message = message;
    }
  }
  
  module.exports = { appErr, AppErr };