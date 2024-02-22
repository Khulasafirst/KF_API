
// Dont delete
exports.globalErrhandler = (err, req, res, next) => {
 
  const stack = err?.stack;
  const message = err?.message;
  const status = err?.status ? err?.status : "failed";
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  if(process.env.NODE_MODE === "DEVELOPMENT"){
  res.status(statusCode).json({
    stack,
    message, 
    status,
  });
  }
  if(process.env.NODE_MODE === "PRODUCTION"){
    res.status(statusCode).json({
      message, 
      status,
    });
    }
};

//404 handler
exports.notFound = (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "failed";
  err.statusCode = 404;
  next(err);
};
// Dont delete