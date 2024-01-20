const express = require("express")
const {sequelize} = require("./models")
const app = express()
const port = 3000

app.use(express.json())
app.listen(port,() => {console.log("Server is ready")})