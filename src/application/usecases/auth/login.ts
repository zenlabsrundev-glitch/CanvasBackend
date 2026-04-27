import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "@/src/config";
import { UserRepository } from "@/src/infrastructure/services/UserRepository";

export default class LoginUsecase {
    constructor(private userRepository: UserRepository) {}

    async exec(credentials: { email: string, password: string }): Promise<{ token: string, user: any } | string> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) return "Invalid credentials";

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return "Invalid credentials";

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn as any }
        );

        const { password, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}
