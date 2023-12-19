

const { default: mongoose } = require("mongoose")
const colors = require('colors');

const dbConnection = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URI)
    console.log(`${"-".repeat(68)}\nDB Connection Successful: ${db.connection.host}\n${"-".repeat(68)}`.cyan)
  } catch (error) {
    console.log(colors.red.underline(error.message))
  }
}

module.exports = dbConnection