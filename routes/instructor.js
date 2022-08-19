import express from "express";

const router = express.Router();

import {makeInstructor} from "../controllers/instructor";
import { requireSignIn } from "../middleware";

router.post("/make-instructor",requireSignIn, makeInstructor)

module.exports = router;
