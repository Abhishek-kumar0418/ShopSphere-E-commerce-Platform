export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : error.message,
    details: process.env.NODE_ENV === "production" ? undefined : error.details || undefined
  });
}
