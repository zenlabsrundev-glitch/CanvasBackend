import { AppDataSource } from "../database";
import { User } from "@/src/adapters/models/User";

export class UserRepository {
    private repository = AppDataSource.getRepository(User);

    async create(userData: Partial<User>): Promise<User> {
        const user = this.repository.create(userData);
        return await this.repository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOneBy({ email });
    }

    async findById(id: string): Promise<User | null> {
        return await this.repository.findOneBy({ id });
    }
}
