class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capture standard V8 stack trace excluding this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
