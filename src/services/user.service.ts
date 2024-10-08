import boom from '@hapi/boom';
import { config } from '../config/config';
import { UserAttributes } from '../db/models/user.model';
import sequelize from '../libs/sequelize';
import { generateBytes, generateRandomCode } from '../utils/random';
import { LimateAttributes } from '../db/models/limate.model';
import createAttestationAvax from '../contracts/EASSchemes/CreateAttestationAvax';
import { createAttestationMinato } from '../contracts/EASSchemes/CreateAttestationMinato';

export default class UserService {
    constructor() {}

    public async create(user : Partial<Omit<UserAttributes, 'id' | 'role' | 'createdAt'>>) {

        const newUserPayload = {
            ...user,
            code: {
                code: generateRandomCode(5)
            }
        };
        console.log(newUserPayload);
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
        const user = await sequelize.models.User.findOne({ 
            where: { username },
            include: [
                {
                    model: sequelize.models.Code,
                    as: 'code',
                }
            ]
        });
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

        const codeUpdated = await code.update({ code: generateRandomCode(5) });

        return codeUpdated;
    }

    public async getUserLimates(id: string) {
        const limates = await sequelize.models.Limate.findAll({ where: { userId: id } });
        return limates;
    }

    public async registerLimate(userId: string, username: string, code: string) {
        console.log(userId, username, code);
        const userToConnect = await this.findByUsername(username);
        if (userToConnect.dataValues.code.dataValues.code !== code)
        {
            throw boom.badRequest('Invalid code');
        }

        const txHashAvax = await createAttestationAvax({
            username: userToConnect.dataValues.username,
            event: 'ETH Mexico',
            address: userToConnect.dataValues.address,
            id: userToConnect.dataValues.id,
            badge: userToConnect.dataValues.badge,
            data: generateBytes()
            },
            userToConnect.dataValues.address
        );

        const txHashMinato = await createAttestationMinato({
            username: userToConnect.dataValues.username,
            event: 'ETH Mexico',
            address: userToConnect.dataValues.address,
            id: userToConnect.dataValues.id,
            badge: userToConnect.dataValues.badge,
            data: generateBytes()
            },
            userToConnect.dataValues.address
        );

        const newLimate : LimateAttributes = {
            username: userToConnect.dataValues.username,
            profilePicture: userToConnect.dataValues.profilePicture,
            about: userToConnect.dataValues.about,
            badge: userToConnect.dataValues.badge,
            txHashAvax: txHashAvax,
            txHashMinato: txHashMinato,
            userId: userId
        };

        const limate = await sequelize.models.Limate.create(newLimate as any);
        return limate;
    }
}