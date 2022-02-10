import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  const data = req.body;

  const { email, passsword } = data;

  if (
    !email ||
    !email.includes("@") ||
    !passsword ||
    !passsword.trim().length < 7
  ) {
    res
      .status(422)
      .json({ message: "invalid input, wachtwoord is niet lang genoeg" });
    return;
  }
  const client = await connectToDatabase();

  const db = client.db();

  const hashedPassword = hashPassword(passsword);

  const result = await db.collection("users").insertOne({
    email: email,
    passsword: hashedPassword,
  });

  res.status(201).json({ message: "User is aangemaakt" });
}

export default handler;
