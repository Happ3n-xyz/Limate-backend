import boom from '@hapi/boom';
import { config } from '../config/config';
import { UserAttributes } from '../db/models/user.model';
import sequelize from '../libs/sequelize';
import { generateBytes, generateRandomCode } from '../utils/random';
import { LimateAttributes } from '../db/models/limate.model';
import createAttestation from '../contracts/EASSchemes/CreareAttestation';

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
        if (changes.username) {
            const userWithUsername = await sequelize.models.User.findOne({ where: { username: changes.username } });
            if (userWithUsername)
            {
                throw boom.badRequest('Username already exists');
            }
        }

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
        try {
            console.log(userId, username, code);
        const userToConnect = await this.findByUsername(username);
        if (userToConnect.dataValues.code.dataValues.code !== code)
        {
            console.log('error finding code, throwing error');
            
            throw boom.badRequest('Invalid code');
        }
        console.log('prev to create attestation');
        
        const txHash = await createAttestation({
                username: userToConnect.dataValues.username,
                event: 'Avalanche Summit Latam',
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
            txHash: txHash,
            userId: userId
        };

        const limate = await sequelize.models.Limate.create(newLimate as any);
        return limate;
        } catch (error) {
            console.log('error creating limate', error);
        }
    }
}