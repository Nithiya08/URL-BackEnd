
import { Router } from "express";
import { deleteUrl, getAllUrls, LongUrl } from "../controller/Url.Controller.js";
import { auth } from "../middleware/auth.js";

export const UrlRouter = Router();


UrlRouter.post("/shortUrl", auth, LongUrl);

UrlRouter.get("/", auth, getAllUrls);
UrlRouter.delete("/:id", auth, deleteUrl);