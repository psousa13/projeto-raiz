require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API em http://localhost:${PORT} (docs: /api-docs)`)))
  .catch((err) => {
    console.error("Falha ao arrancar:", err.message);
    process.exit(1);
  });
