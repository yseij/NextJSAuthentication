import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://nestjs:1234@cluster0.o0r9z.mongodb.net/auth-demo?retryWrites=true&w=majority"
  );

  return client;
}
