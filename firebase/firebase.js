const admin = require("firebase-admin");

// Load Firebase Service Account Key
const serviceAccount = require(".././baking-bytes-firebase-adminsdk-fbsvc-e7a395b76e.json"); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
