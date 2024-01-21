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

app.get("/albums", async (req, res) => {
    try {
        const album = await Album.findAll();
        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/albums/:id", async (req, res) => {
    const album_id = req.params.id;
    try {
        const album = await Album.findByPk(album_id);
        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }
        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/albums/:id/songs", async (req, res) => {
    const album_id = req.params.id;
    try {
        const album = await Album.findByPk(album_id);
        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }
        const song = await Song.findAll({
            where: { album_id: album_id }
        });
        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
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

app.post("/albums", async (req, res) => {
    const {title, image, date, artist_id} = req.body
    if(!title){
        res.status(400).json({error:"Title field missing"})
        return
    }
    if(!image){
        res.status(400).json({error:"Image field missing"})
        return
    }
    if(!date){
        res.status(400).json({error:"Date field missing"})
        return
    }
    if(!artist_id){
        res.status(400).json({error:"Artist_id field missing"})
        return
    }
    const album = await Album.create({
        title,
        image,
        date,
        artist_id
    })
    res.status(201).json(album)
})
app.post("/albums/:id/songs", async (req, res) => {
    const { id } = req.params;
    const { title, time, type } = req.body;

    if (!title || !time || !type) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        const album = await Album.findByPk(id);
        if (!album) {
            res.status(404).json({ error: "Album not found" });
            return;
        }
        const song = await Song.create({
            title,
            time,
            type,
            album_id: id
        });
        res.status(201).json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/albums/:id", async (req, res) => {
    const { id } = req.params;
    const { title, image, date, artist_id } = req.body;

    if (!title && !image && !date && !artist_id) {
        res.status(400).json({ error: "No data provided for update" });
        return;
    }

    try {
        const album = await Album.findByPk(id);
        if (!album) {
            res.status(404).json({ error: "Album not found" });
            return;
        }

        if (title) album.title = title;
        if (image) album.image = image;
        if (date) album.date = date;
        if (artist_id) album.artist_id = artist_id;

        await album.save();

        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
app.delete("/albums/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const album = await Album.findByPk(id);
        if (!album) {
            res.status(404).json({ error: "Album not found" });
            return;
        }

        await album.destroy();
        res.status(200).json({ message: "Album successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




