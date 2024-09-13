import bodyParserMiddleware from "@/middleware/parse-body";
import { RateLimiterMiddleware } from "@/middleware/rate-limiter";
import { AuthenticationMiddleware } from "@/middleware/session";
import { Hono } from "hono";
import authRouter from "./auth";
import projectRouter from "./project";
import searchRouter from "./search";
import teamRouter from "./team";
import userRouter from "./user";

const router = new Hono();

// MIDDLEWARES
router.use("*", bodyParserMiddleware);
router.use("*", RateLimiterMiddleware);
router.use("*", AuthenticationMiddleware);

// Routers
router.route("/auth", authRouter);
router.route("/user", userRouter);
router.route("/project", projectRouter);
router.route("/team", teamRouter);
router.route("/search", searchRouter);

export default router;