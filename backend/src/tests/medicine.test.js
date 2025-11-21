// src/tests/medicine.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../server.js";
import Medicine from "../models/medicineModel.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "healio_test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Medicine API", () => {
  it("should add a new medicine", async () => {
    const res = await request(app)
      .post("/api/medicines")
      .send({
        name: "Paracetamol",
        manufacturer: "Cipla",
        price: 25,
        stock: 100,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("medicine");
  });

  it("should search for a medicine", async () => {
    await Medicine.create({ name: "Amoxicillin", manufacturer: "Sun Pharma", price: 50 });
    const res = await request(app).get("/api/medicines/search?q=amox");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should delete a medicine", async () => {
    const med = await Medicine.create({
      name: "Ibuprofen",
      manufacturer: "Dr Reddy's",
      price: 30,
    });

    const res = await request(app).delete(`/api/medicines/${med._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
