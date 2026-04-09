/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require("firebase-admin");

const getFirebaseApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
};

const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return admin.auth(app);
};

module.exports = { getFirebaseAuth };
