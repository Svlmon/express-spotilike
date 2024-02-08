const express = require("express")
const {sequelize} = require("./models")
const app = express()
const port = 3000
const AuthenticationService = require('./services/AuthenticationService');

const authService = new AuthenticationService();

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
app.get("/types", async (req, res) => {
    try {
        const type = await Type.findAll();
        res.status(200).json(type);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/artists/:id/songs", async (req, res) => {
    const artist_id = req.params.id;

    try {
        const artist = await Artist.findByPk(artist_id);
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        const songs = await Song.findAll({
            where: { artist_id: artist_id }
        });

        res.status(200).json(songs);
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
    try{
        const hashedPassword = await authService.generate_hached_password(password);

        const user = await User.create({
            username,
            password: hashedPassword,
            mail
        })
        res.status(201).json(user)
    }catch (error){
        res.status(500).json({ error: error.message });
    }

})

app.post("/users/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            where: { username }
        });

        if (!user || !(await authService.compare_password(password, user.password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = authService.generate_token({user_id: user.id})

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


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
    try{
        const album = await Album.create({
            title,
            image,
            date,
            artist_id
        })
        res.status(201).json(album)
    }catch (error){
        res.status(500).json({ error: error.message });
    }

})
app.post("/albums/:id/songs", async (req, res) => {
    const { album_id } = req.params.id;
    const { title, time,artist_id, type_id} = req.body;

    if (!title || !time ||!type_id) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        const album = await Album.findByPk(album_id);
        if (!album) {
            res.status(404).json({ error: 'Error album id :' + album_id});
            return;
        }
        const artist = await Artist.findByPk(artist_id);
        if (!artist){
            res.status(409).json({error: 'Error artist id: ' + artist_id});
            return;
        }
        const type = await Type.findByPk(type_id);
        if (!type){
            res.status(409).json({error: 'Error type id: ' + type_id});
            return;
        }
        const song = await Song.create({
            title,
            time,
            artist_id,
            type_id,
            album_id,
        });
        res.status(201).json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/artists/:id", async (req, res) => {
    const { id } = req.params;
    const { name, image, biographie } = req.body;

    if (!name && !image && !biographie) {
        res.status(400).json({ error: "No data provided for update" });
        return;
    }

    try {
        const artist = await Artist.findByPk(id);
        if (!artist) {
            res.status(404).json({ error: "Artist not found" });
            return;
        }

        if (name) artist.name = name;
        if (image) artist.image = image;
        if (biographie) artist.biographie = biographie;


        await artist.save();

        res.status(200).json(artist);
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

app.put("/types/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
        res.status(400).json({ error: "No data provided for update" });
        return;
    }

    try {
        const type = await Type.findByPk(id);
        if (!type) {
            res.status(404).json({ error: "Type not found" });
            return;
        }

        if (title) type.title = title;
        if (description) type.description = description;

        await type.save();

        res.status(200).json(type);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/users/:id", authService.authenticate_token.bind(authService), async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await user.destroy();
        res.status(200).json({ message: "User and associated records successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete("/albums/:id", authService.authenticate_token.bind(authService),async (req, res) => {
    const { id } = req.params;

    try {
        const album = await Album.findByPk(id);
        if (!album) {
            res.status(404).json({ error: "Album not found" });
            return;
        }

        await Song.destroy({
            where: { album_id: id }
        });



        await album.destroy();
        res.status(200).json({ message: "Album and associated records successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.delete("/artists/:id", authService.authenticate_token.bind(authService),async (req, res) => {
    const { id } = req.params;

    try {
        const artist = await Artist.findByPk(id);
        if (!artist) {
            res.status(404).json({ error: "Artist not found" });
            return;
        }

        await Song.destroy({
            where: {
                artist_id: artist.id
            }
        });
        await Album.destroy({
            where: {
                artist_id: artist.id
            }
        });
        await artist.destroy();


        res.status(200).json({ message: "Artist and associated records successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});








