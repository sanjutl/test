import dontenv from "dotenv";
import connectDb from "./config/db.js";
import app from "./app.js";

dontenv.config();
const PORT = process.env.PORT || 8000;
connectDb();

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
