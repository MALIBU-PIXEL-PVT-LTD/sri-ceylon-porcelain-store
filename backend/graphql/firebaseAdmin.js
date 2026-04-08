/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require("firebase-admin");
const serviceAccount = require("../key.json");

const getFirebaseApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return admin.auth(app);
};

module.exports = { getFirebaseAuth };
