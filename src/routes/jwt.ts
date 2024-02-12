import { Router } from "express";
import { encodeSession } from "../utils/encodeSession";

const router = Router();

router.post("/", async (req, res) => {
  const key = process.env.SECRET_JWT; 
  if (!key) {
    return res.status(500).json({ error: "Server configuration error" });
  }
  const session = encodeSession(key, {
    id: 123,
    username: "some user",
    dateCreated: Date.now(),
  });

  res.status(201).json(session);
});

export default router;
