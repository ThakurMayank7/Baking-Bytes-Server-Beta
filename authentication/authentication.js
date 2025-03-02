const db = require("../firebase/firebase");
const bcrypt = require("bcrypt");

async function createUser({ userName, email, password }) {
  const hashedPassword = await encryptPassword(password);

  const docRef = await db.collection("users").add({
    userName,
    email,
    hashedPassword,
  });

  return docRef.id;
}

async function encryptPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function verifyPassword(inputPassword, storedHash) {
  const match = await bcrypt.compare(inputPassword, storedHash);
  return match;
}

module.exports = { createUser,verifyPassword };
