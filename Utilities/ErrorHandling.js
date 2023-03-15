class ErrorHandling extends Error {
  constructor(message, stausCode) {
    super(message), (this.stausCode = stausCode);
    this.staus = `${stausCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandling;
