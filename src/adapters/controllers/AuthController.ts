import { Request, Response, Router } from "express";
import Joi from "joi";
import { UserRepository } from "@/src/infrastructure/services/UserRepository";
import RegisterUsecase from "@/src/application/usecases/auth/register";
import LoginUsecase from "@/src/application/usecases/auth/login";
import { authenticate } from "@/src/frameworks/middleware/auth";
import { validate } from "@/src/frameworks/middleware/validator";

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
        const result = await usecase.exec(req.body);
        if (typeof result === "string") {
            return res.status(401).json({ error: result });
        }
        
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        return res.status(200).json(result);
    }

    async logoutHandler(req: Request, res: Response) {
        res.clearCookie('token');
        return res.status(200).json({ message: "Logged out successfully" });
    }

    async meHandler(req: any, res: Response) {
        return res.status(200).json(req.user);
    }
}
