import express from "express";
import { SendDataAdmin } from "../../controllers/adminController.js";
import {isAdmin} from "../../middleware/validateTokenHandler.js";
const router = express.Router();


router.post('/SendDataAdmin',isAdmin, SendDataAdmin)


export default router;
