
# API Spotilike

Ce projet est une application backend API REST express contenant des artistes avec des albums et des chansons. Ce projet contient des routes et une authentification JWT.

## Technologies utilisées 

- SQLite : Un système de gestion de bases de données relationnelles léger, intégré dans l'application, sans nécessiter de serveur distinct.

- WebStorm : Un environnement de développement intégré (IDE) offrant un support avancé pour le développement avec Node.js et JavaScript.

- DataGrip : Un outil de gestion de bases de données dans la suite IntelliJ, fournissant une interface intuitive pour travailler avec différentes bases de données.

- Node.js : Un environnement d'exécution côté serveur basé sur JavaScript, permettant de développer des applications web évolutives.

- Express.js : Un framework web minimaliste pour Node.js, simplifiant la création d'applications web et d'API REST.

- Sequelize : Un ORM (Object-Relational Mapping) JavaScript pour Node.js, simplifiant l'interaction avec les bases de données relationnelles.

- GitKraken : Un client Git graphique facilitant le suivi des versions, la gestion des branches et la collaboration dans les projets.

- Postman : Un outil de test d'API offrant une interface conviviale pour explorer, tester et documenter les requêtes API.

## Installation en local 

### Clone Repository Git

`https://github.com/Svlmon/express-spotilike.git`

### Pré-Requis

- Node.js

### Installation des dépendances 

`npm install`

## Base de données 

### Diagramme base de données 

![bdd](https://github.com/Svlmon/express-spotilike/assets/93972930/0440f4b2-20ec-45b1-8458-6f29ded67f53)

### Tables

- Artiste

`create table Artist
(
    id         INTEGER
        primary key autoincrement,
    name       TEXT,
    image      TEXT,
    biographie TEXT
);`

- Album 

`create table Album
(
    id        INTEGER
        primary key autoincrement,
    title     VARCHAR(255),
    image     VARCHAR(255),
    date      DATE,
    artist_id INT
        references Artist
);`

- Type 

`create table Type
(
    id          INTEGER
        primary key autoincrement,
    title       TEXT,
    description TEXT
);
`

- Song

`create table Song
(
    id        INTEGER
        primary key autoincrement,
    title     VARCHAR(255),
    time      INT,
    artist_id INT
        references Artist,
    type_id   INT
        references Type,
    album_id  INT
        references Album
);`

- User 

`create table User
(
    id       INTEGER
        primary key autoincrement,
    username TEXT,
    password TEXT,
    mail     TEXT
);`

### Tables de jointures

- Song_Album 

`create table Song_Album
(
    song_id  INT
        references Song
            on delete cascade,
    album_id INT
        references Album
            on delete cascade,
    primary key (song_id, album_id)
);`

- Song_Artist

`create table Song_Artist
(
    song_id   INT
        references Song,
    artist_id INT
        references Artist
            on delete cascade,
    primary key (song_id, artist_id)
);`

- Song_Type

`create table Song_Type
(
    song_id INT
        references Song,
    type_id INT
        references Type,
    primary key (song_id, type_id)
);`

## Implémentation

- Init models
```
var DataTypes = require("sequelize").DataTypes;
var _Album = require("./Album");
var _Artist = require("./Artist");
var _Song = require("./Song");
var _Song_Album = require("./Song_Album");
var _Song_Artist = require("./Song_Artist");
var _Song_Type = require("./Song_Type");
var _Type = require("./Type");
var _User = require("./User");

function initModels(sequelize) {
  var Album = _Album(sequelize, DataTypes);
  var Artist = _Artist(sequelize, DataTypes);
  var Song = _Song(sequelize, DataTypes);
  var Song_Album = _Song_Album(sequelize, DataTypes);
  var Song_Artist = _Song_Artist(sequelize, DataTypes);
  var Song_Type = _Song_Type(sequelize, DataTypes);
  var Type = _Type(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);


  return {
    Album,
    Artist,
    Song,
    Song_Album,
    Song_Artist,
    Song_Type,
    Type,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

```

- Routes 

```
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
const {Song_Artist} = initModels(sequelize)
const {Song_Album} = initModels(sequelize)

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

app.put("/artists/:id", async (req, res) => {
    const { id } = req.params;
    const { name, image,biographie } = req.body;

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
            res.status(404).json({ error: "Gender not found" });
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

        await Song_Artist.destroy({
            where: { artist_id: user.id }
        });

        await Song_Album.destroy({
            where: { song_id: user.id }
        });

        await user.destroy();
        res.status(200).json({ message: "User and associated records successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete("/albums/:id", authService.authenticate_token,async (req, res) => {
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

        await Song_Album.destroy({
            where: { album_id: album.id }
        });

        await album.destroy();
        res.status(200).json({ message: "Album and associated records successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.delete("/artists/:id", authService.authenticate_token,async (req, res) => {
    const { id } = req.params;

    try {
        const artist = await Artist.findByPk(id);
        if (!artist) {
            res.status(404).json({ error: "Artist not found" });
            return;
        }

        await Song_Artist.destroy({
            where: { artist_id: artist.id }
        });

        await artist.destroy();
        res.status(200).json({ message: "Artist and associated records successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

- Service d'authentification (Token JWT)

```
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { sequelize } = require("../models");
const { initModels } = require("../models/init-models");
const secret_key = "secret_key";


const { User } = initModels(sequelize);

class AuthenticationService {
    static HTTP_UNAUTHORIZED = 401;
    static HTTP_FORBIDDEN = 403;

    generate_token(data) {
        return jwt.sign(data, secret_key);
    }

    async authenticate_token(req, res, next) {
        const token = req.header('Authorization');

        if (!token || !token.startsWith('Bearer')) {
            return res.status(AuthenticationService.HTTP_UNAUTHORIZED).json({ error: "Unauthorized or wrong method: use bearer" });
        }

        try {
            const is_authorize = this.verify_token(token);
            if (!is_authorize) {
                return res.status(AuthenticationService.HTTP_FORBIDDEN).json({ error: "Forbidden" });
            }

            req.user = await User.findByPk(is_authorize.user_id);
            next();
        } catch (error) {
            res.status(AuthenticationService.HTTP_FORBIDDEN).json({ error: error.message });
        }
    }

    verify_token(token) {
        try {
            return token ? jwt.verify(token.split(" ")[1], secret_key) : null;
        } catch (error) {
            return null;
        }
    }

    async generate_hached_password(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    compare_password(password, form_password) {
        return bcrypt.compare(password, form_password);
    }
}

module.exports = AuthenticationService;

```

## Lancer l'API 

`cd backend`
`npm start`

## Tests

Les tests des routes et de l'authentification se font sur Postman: [lien](https://www.postman.com/titouanf/workspace/fastapi-pokemon/collection/31230225-5a273857-17a6-4bf7-b24f-c63f59b0e231?action=share&creator=31230225)

Titouan FORAS





