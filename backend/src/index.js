import "dotenv/config";
import { app } from "./app.js";
import { connectMongo, disconnectMongo } from "./db.js";

const PORT = Number(process.env.PORT) || 4002;

async function main() {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`SERVER LISTEING ON :${PORT}`);
  });
}
main().catch((err) => {
  console.log(err, "error listening to port ");
});

process.on("SIGINT", async () => {
  await disconnectMongo();
  process.exit(0);
});
