import express from "express";
import prisma from "../db.server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { shop, name, phoneNumber, email } = req.body;

  if (!shop || !name || !phoneNumber || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const contact = await prisma.contactForm.create({
      data: { shop, name, phoneNumber, email },
    });
    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save contact form" });
  }
});

router.get("/", async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).json({ error: "Shop required" });

  const contacts = await prisma.contactForm.findMany({
    where: { shop, isDeleted: false },
    orderBy: { submittedAt: "desc" },
  });
  res.json(contacts);
});

export default router;
