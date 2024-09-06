import boom from '@hapi/boom';
import { config } from '../config/config';
import { UserAttributes } from '../db/models/user.model';
import sequelize from '../libs/sequelize';

export default class UserService {
    constructor() {}

    public async create(user : Partial<Omit<UserAttributes, 'id' | 'role' | 'createdAt'>>) {
        const newUser = await sequelize.models.User.create(user);
        return newUser;
    }

    public async findById(id: string) {
        const user = await sequelize.models.User.findByPk(id);
        if (!user)
        {
            throw boom.notFound('User not found');
        }
        return user;
    }

    public async findByWalletAddress(address: string) {
        const user = await sequelize.models.User.findOne({ where: { address } });
        return user;
    }

    public async update(id: string, changes : Partial<Omit<UserAttributes, 'id' | 'role' | 'createdAt'>>) {
        const user = await this.findById(id);
        const updatedUser = await user.update(changes);
        return updatedUser;
    }

}