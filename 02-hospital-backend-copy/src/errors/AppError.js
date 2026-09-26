class AppError extends Error {
  /**
   * @param {string} message - thông báo cho client
   * @param {number} statusCode - HTTP status
   * @param {string} code - mã lỗi máy đọc được (VALIDATION_ERROR, ...)
   * @param {unknown} [details] - chi tiết (ví dụ danh sách lỗi field)
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }
}

module.exports = AppError;
