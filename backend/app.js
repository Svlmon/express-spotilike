const express = require("express")
const {sequelize} = require("./models")
const app = express()
const port = 3000

const {initModels} = require("./models/init-models")
const {User} = initModels(sequelize)
const {Album} = initModels(sequelize)
const {Song} = initModels(sequelize)
const {Type} = initModels(sequelize)
const {Artist} = initModels(sequelize)

app.use(express.json())
app.listen(port,() => {console.log("Server is ready")})


app.post("/users/signin", async (req, res) => {
    const {username, password, mail} = req.body
    if(!username){
        res.status(400).json({error:"Username field missing"})
        return
    }
    if(!password){
        res.status(400).json({error:"Password field missing"})
        return
    }
    if(!mail){
        res.status(400).json({error:"Mail field missing"})
        return
    }
    const user = await User.create({
        username,
        password,
        mail
    })
    res.status(201).json(user)
})

app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await user.destroy();
        res.status(200).json({ message: "User successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




