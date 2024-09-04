import { config } from '../config/config';
import UserService from './user.service';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';
import boom from '@hapi/boom';
import { generateSignString } from '../utils/random';

export default class AuthService {

    private userservice : UserService;

    constructor() {
        this.userservice = new UserService();
    }

    public async generateNonce(address: string, username: string) {
        address = address.toLowerCase();
        let user = await this.userservice.findByWalletAddress(address);
        const nonce = generateSignString(15);
      
        if (!user) {
            const userPayload = {
                username: username,
                address: address,
                nonce: nonce,
            }
            await this.userservice.create(userPayload);
        } else {
            const id = user.dataValues.id;
            await this.userservice.update(id, { nonce });
        }
      
        return { address, nonce };
    }
    
    public async signedSignIn(address : string, nonce : string, signature : string) {
        address = address.toLowerCase();
        const user = await this.userservice.findByWalletAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }

        if (user.get('nonce') !== nonce) {
            throw boom.unauthorized('Invalid nonce');
        }

        const verifyAddress = verifyMessage(nonce, signature);
        const userAddress = user.get('address') as string;

        if (verifyAddress.toLowerCase() !== userAddress.toLowerCase()) {
            throw boom.unauthorized('Invalid signature');
        }

        const newNonce = generateSignString(15);
        const id = user.get('id');
        const updatedUser = await this.userservice.update(id as string, { nonce: newNonce });

        const tokenPayload = {
            id: updatedUser.get('id'),
            role: updatedUser.get('role'),
        }

        const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

        return { user: updatedUser, token: token };
    }

    public async autoSignIn(id: string) {
        const userRecord = await this.userservice.findById(id);
        if (!userRecord) {
            throw boom.notFound('User not found');
        }
        
        const tokenPayload = {
            id: userRecord.get('id'),
            role: userRecord.get('role'),
        }

        const freshToken = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

        return { user: userRecord, token: freshToken };
    }
}