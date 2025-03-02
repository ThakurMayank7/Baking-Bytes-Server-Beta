const jwt = require("jsonwebtoken");

const SECRET_KEY =
  process.env.JWT_SECRET ||
  "250972026d4697623f9babcb4a54449c8af38c5d0831bc57366cdd2951237c82760c76dbb5f784ce838e5ed61b1c5d33818d778421144620b65e34ad51c94915d4059ff05f3b5ad8708edd571c6a007990ac6d34022d476a5ddcd06da538ba4ddeb6a37796a3268781cb9d42c9e0ab4d346ef7fe87b3cd4a091aa487651f7956f67a1894c819bec46939036bd9ce40b20a79a32dbfc1b8f7a98a21d54b97b23576b92e7657055d6a5e1855c0d2093604a0deaf87bda88c30c87fd6524d3cdf7fca001607c746b1a0761d10b12b07fb70fa0fbebdec45655ce3d42d47530a6dd2342fb80768ccea13973acf7b1a84a5fcadb28382ed369edb058d8e12df56fc1e";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    console.log("Passed Middleware");

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { authenticateJWT };
