// src/tests/booking.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../server.js";
import Appointment from "../models/appointmentModel.js";

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

describe("Booking API", () => {
  it("should create a new appointment", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        patientId: "test-patient-1",
        doctorId: "test-doctor-1",
        date: "2025-12-01",
        time: "10:00 AM",
        reason: "Fever and cold",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("appointment");
  });

  it("should retrieve appointments for a user", async () => {
    const res = await request(app).get("/api/bookings/my");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should cancel an appointment", async () => {
    const appt = await Appointment.create({
      patientId: "temp",
      doctorId: "temp",
      date: "2025-12-02",
      time: "11:00 AM",
    });

    const res = await request(app).delete(`/api/bookings/${appt._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/cancelled/i);
  });
});
