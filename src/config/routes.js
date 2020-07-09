import methodOverride from 'method-override';
import routes from '../routes/index';

export default function (app) {
  app.use(methodOverride('X-HTTP-Method-Override'));

  app.use(
    methodOverride((req) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;

        return method;
      }

      return undefined;
    }),
  );

  app.use(async (req, res, next) => {
    res.redirectBack = () => {
      const backURL = req.header('Referer') || '/';
      return res.redirect(backURL);
    };

    res.locals.firebaseApiKey = process.env.FIREBASE_API_KEY;
    res.locals.firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
    res.locals.firebaseSenderId = process.env.FIREBASE_SENDER_ID;
    res.locals.firebaseAppId = process.env.FIREBASE_APP_ID;

    next();
  });

  app.use(routes);
}
