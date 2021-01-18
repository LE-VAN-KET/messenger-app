import dotenv from 'dotenv';
dotenv.config();
import Service from '../Services/AuthService';

class AuthMiddleware {
    isAuth(req, res, next) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const tokenFromClient = req.headers.authorization.split(' ')[1];
        if (tokenFromClient) {
            try {
                new Service().verifyToken(tokenFromClient, accessTokenSecret).then((user) => {
                    req.authUser = {
                        id: user.id,
                    };
                    next();
                });
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error while verify token.' });
            }
        } else {
            return res.status(500).json({ message: 'No token provided.' });
        }
    }
}
export default AuthMiddleware;
