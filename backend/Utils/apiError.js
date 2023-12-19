class apiError extends Error {
  constructor(message, statusCode){
    super(message)
    this.statusText = `${statusCode}`.startsWith(4) ? "Fail" : "Error"
    this.statusCode = statusCode
    this.statusMessage = message
    this.isOperational = true
  }
}

module.exports = apiError