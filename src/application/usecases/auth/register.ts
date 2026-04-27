import bcrypt from "bcryptjs";
import { User } from "../../../adapters/models/User";
import { UserRepository } from "../../../infrastructure/services/UserRepository";

export default class RegisterUsecase {
    constructor(private userRepository: UserRepository) {}

    async exec(userData: Partial<User>): Promise<User | string> {
        if (!userData.email || !userData.password) {
            return "Email and password are required";
        }

        const existing = await this.userRepository.findByEmail(userData.email);
        if (existing) return "User already exists";

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await this.userRepository.create({
            ...userData,
            password: hashedPassword
        });
    }
}
