
import { Router } from "express";
import { Login, register } from "../controller/User.Controller.js";


export const UserRouter = Router();

UserRouter.post("/register", register);
UserRouter.post("/login", Login); 