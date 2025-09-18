import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;

  console.log("MongoDB_URI:", uri);

  if (!uri) throw new Error("MongoDB_URI is missing");
  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  console.log("Mongo connected");
}

export async function disconnectMongo() {
  await mongoose.connection.close();
  console.log("Mongo Disconnected");
}
