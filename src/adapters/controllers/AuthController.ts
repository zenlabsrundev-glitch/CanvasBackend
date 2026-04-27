import { Request, Response, Router } from "express";
import Joi from "joi";
import { UserRepository } from "../../infrastructure/services/UserRepository";
import RegisterUsecase from "../../application/usecases/auth/register";
import LoginUsecase from "../../application/usecases/auth/login";
import { authenticate } from "../../frameworks/middleware/auth";
import { validate } from "../../frameworks/middleware/validator";

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export class AuthController {
    public router: Router = Router();

    constructor(private userRepository: UserRepository) {
        this.router.post("/register", validate(registerSchema), this.registerHandler.bind(this));
        this.router.post("/login", validate(loginSchema), this.loginHandler.bind(this));
        this.router.get("/me", authenticate, this.meHandler.bind(this));
        this.router.post("/logout", this.logoutHandler.bind(this));
    }

    async registerHandler(req: Request, res: Response) {
        const usecase = new RegisterUsecase(this.userRepository);
        const result = await usecase.exec(req.body);
        if (typeof result === "string") {
            return res.status(400).json({ error: result });
        }
        return res.status(201).json(result);
    }

    async loginHandler(req: Request, res: Response) {
        const usecase = new LoginUsecase(this.userRepository);
        const result = await usecase.exec({ email: req.body.email, password: req.body.password });
        if (typeof result === "string") {
            return res.status(401).json({ error: result });
        }

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json(result);
    }

    async meHandler(req: any, res: Response) {
        const user = await this.userRepository.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.status(200).json(user);
    }

    async logoutHandler(req: Request, res: Response) {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    }
}
