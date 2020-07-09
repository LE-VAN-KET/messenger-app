import Service from '../Services/AuthService';

class AuthMiddleware {
    isAuth(req, res, next) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-anhle1512001@gmail.com';
        const tokenFromClient = req.headers.authorization.split(' ')[1];
        if (tokenFromClient) {
            try {
                new Service().verifyToken(tokenFromClient, accessTokenSecret).then((user) => {
                    req.authUser = {
                        id: user.id,
                        lastName: user.lastName,
                        firstName: user.firstName,
                        phoneNumber: user.phoneNumber,
                    };
                    next();
                });
            } catch (err) {
                console.log(err);
                return res.status(401).json({ message: 'Error while verify token.' });
            }
        } else {
            return res.status(403).send({ message: 'No token provided.' });
        }
    }
}
export default AuthMiddleware;
