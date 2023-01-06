import express from "express";
import { getTesting, saveTesting } from "../controllers/TestingController.js";

const TestingRoutes = express.Router();

TestingRoutes.get('/testing', getTesting);
TestingRoutes.post('/testing', saveTesting);

// TestingRoutes.post('/users', Register);
// TestingRoutes.post('/login', Login);
// TestingRoutes.get('/token', refreshToken);
// TestingRoutes.delete('/logout', Logout);

export default TestingRoutes;