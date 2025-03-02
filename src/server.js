require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { authenticateJWT } = require("../middleware/auth");

const {
  createUser,
  verifyPassword,
} = require("../authentication/authentication");

const db = require("../firebase/firebase");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const SECRET_KEY =
  process.env.JWT_SECRET ||
  "250972026d4697623f9babcb4a54449c8af38c5d0831bc57366cdd2951237c82760c76dbb5f784ce838e5ed61b1c5d33818d778421144620b65e34ad51c94915d4059ff05f3b5ad8708edd571c6a007990ac6d34022d476a5ddcd06da538ba4ddeb6a37796a3268781cb9d42c9e0ab4d346ef7fe87b3cd4a091aa487651f7956f67a1894c819bec46939036bd9ce40b20a79a32dbfc1b8f7a98a21d54b97b23576b92e7657055d6a5e1855c0d2093604a0deaf87bda88c30c87fd6524d3cdf7fca001607c746b1a0761d10b12b07fb70fa0fbebdec45655ce3d42d47530a6dd2342fb80768ccea13973acf7b1a84a5fcadb28382ed369edb058d8e12df56fc1e";

app.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const userId = await createUser({ userName, email, password });

  if (!userId) {
    return res.status(400).send("Error creating user");
  }

  const payload = { userName, email, userId };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

  res.send({ token });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const userRef = db.collection("users").where("email", "==", email);
  const snapshot = await userRef.get();

  if (snapshot.empty) {
    return res.status(404).send("User not found");
  }

  const user = snapshot.docs[0].data();

  const result = await verifyPassword(password, user.hashedPassword);
  if (!result) {
    return res.status(401).send("Invalid password");
  }

  const payload = {
    userName: user.userName,
    email,
    userId: snapshot.docs[0].id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

  res.send({ token });
});

app.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send("Missing token");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    res.send(decoded ? true : false);
  } catch (error) {
    res.status(401).send("Invalid token");
  }
});

app.post("/modify-text", authenticateJWT, async (req, res) => {
  const { text } = req.body;
  const { userId } = req.user;

  if (!text) {
    return res.status(400).send("Missing required fields");
  }

  res.send(true);

  // const userRef = db.collection("users").doc(userId);

  // try {
  //   await userRef.update({ text });
  //   res.send("Text updated");
  // } catch (error) {
  //   res.status(400).send("Error updating text");
  // }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
