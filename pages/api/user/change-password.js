import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../lib/db";
import { verifyPassword, hashPassword } from "../../../lib/auth";
async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({
    req: req,
  });

  if (!session) {
    res.status(401).json({ message: "niet geauthenticeerd" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(401).json({ message: "user niet gevonden" });
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEquel = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEquel) {
    client.close();
    res.status(403).json({ message: "Wachtwoord is niet goed" });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  usersCollection.updateOne(
    {
      email: userEmail,
    },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );

  client.close();
  res.status(200).json({ message: "Wachtwoord is geupdated" });
}

export default handler;
