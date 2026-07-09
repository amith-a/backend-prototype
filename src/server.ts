import env from "../src/config/env";
import app from "./app";
import pool from "./config/postgres";

async function start() {
  try {
    await pool.query("SELECT NOW()");

    console.log("Database Connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error("Database Connection Failed");
    console.error(err);

    process.exit(1);
  }
}

start();
