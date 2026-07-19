function errorHandler(err, req, res, _next) {
  console.error("API Error:", err.message);
  console.error(err.stack);

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
