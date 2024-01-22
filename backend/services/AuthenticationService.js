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
