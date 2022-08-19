import express from "express";

const router = express.Router();

import {makeInstructor, getAccountStatus} from "../controllers/instructor";
import { requireSignIn } from "../middleware";

router.post("/make-instructor",requireSignIn, makeInstructor)
router.post("/get-account-status", requireSignIn, getAccountStatus)

module.exports = router;
