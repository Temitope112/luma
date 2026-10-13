import {
  Router,
} from "express";

import {
  promoteUserToOrganizer,
} from "../controllers/dev-admin.controller.js";

const router = Router();

router.post(
  "/promote-organizer",
  promoteUserToOrganizer
);

export default router;