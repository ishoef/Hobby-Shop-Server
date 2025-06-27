const admin = require("firebase-admin");
const serviceAccount = require("./admin-access-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



module.exports = admin;
