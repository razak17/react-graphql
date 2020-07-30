const admin = require("firebase-admin");
const serviceAccount = require("../config/google-auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://graphqlnodereact.firebaseio.com"
});

exports.authCheck = async (req) => {
  try {
    const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    console.log("CURRENT_USER", currentUser);
    return currentUser;
  } catch (err) {
    console.log("AUTH_CHECK_ERROR", err);
    throw new Error("Token is invalid or expired");
  }
};

exports.authCheckMiddleware = (req, res, next) => {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then((result) => {
        next();
      })
      .catch((err) => console.log(err));
  } else {
    res.json({ error: "User is not Authorized." });
  }
};
