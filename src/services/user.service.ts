import boom from '@hapi/boom';
import { config } from '../config/config';
import { UserAttributes } from '../db/models/user.model';
import sequelize from '../libs/sequelize';
import { generateRandomCode } from '../utils/random';
import { LimateAttributes } from '../db/models/limate.model';

export default class UserService {
    constructor() {}

    public async create(user : Partial<Omit<UserAttributes, 'id' | 'role' | 'createdAt'>>) {

        const newUserPayload = {
            ...user,
            code: generateRandomCode(5)
        };

        const newUser = await sequelize.models.User.create(newUserPayload, {
            include: [
                {
                    model: sequelize.models.Code,
                    as: 'code',
                }
            ]
        });

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

    public async findByUsername(username: string) {
        const user = await sequelize.models.User.findOne({ where: { username } });
        if (!user)
        {
            throw boom.notFound('User not found');
        }
        return user;
    }

    public async update(id: string, changes : Partial<Omit<UserAttributes, 'id' | 'role' | 'createdAt'>>) {
        const user = await this.findById(id);
        const updatedUser = await user.update(changes);
        return updatedUser;
    }

    public async getUserCode(id: string) {
        const code = await sequelize.models.Code.findOne({ where: { userId: id } });
        if (!code)
        {
            throw boom.notFound('No Codes for this user');
        }

        return code;
    }

    public async getUserLimates(id: string) {
        const limates = await sequelize.models.Limate.findAll({ where: { userId: id } });
        return limates;
    }

    public async registerLimate(userId: string, username: string, code: string) {
        const userToConnect = await this.findByUsername(username);
        const currentCode = await this.getUserCode(userToConnect.dataValues.id);

        if (currentCode.dataValues.code !== code)
        {
            throw boom.badRequest('Invalid code');
        }

        //TODO: Add attestation service

        const newLimate : LimateAttributes = {
            username: userToConnect.dataValues.username,
            profilePicture: userToConnect.dataValues.profilePicture,
            about: userToConnect.dataValues.about,
            badge: userToConnect.dataValues.badge,
            txHash: '0x00', //TODO add attestation hash
            userId: userId
        };

        const limate = await sequelize.models.Limate.create(newLimate as any);
        return limate;
    }
}