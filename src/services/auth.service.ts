import { config } from '../config/config';
import UserService from './user.service';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';
import boom from '@hapi/boom';
import { generateRandomUsername, generateSignString } from '../utils/random';
import { SiweMessage } from 'siwe';
import { publicClient } from '../utils/viemClient';

export default class AuthService {

    private userservice : UserService;

    constructor() {
        this.userservice = new UserService();
    }

    public async generateNonce(address: string) {
        address = address.toLowerCase();
        let user = await this.userservice.findByWalletAddress(address);
        const nonce = generateSignString(10);
      
        if (!user) {
            const userPayload = {
                username: await generateRandomUsername(),
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
    
    public async signedSignIn(address : string, nonce : string, signature : string, message: SiweMessage) {
        console.log('signedSignIn call start');
        
        address = address.toLowerCase();
        const user = await this.userservice.findByWalletAddress(address);
        
        
        if (!user) {
            throw boom.notFound('User not found');
        }
        console.log('nonce', nonce);
        console.log('user nonce ', user.get('nonce'));

        if (user.get('nonce') !== nonce) {
            throw boom.unauthorized('Invalid nonce');
        }

        if (!message) {
            throw boom.badRequest('Invalid message');
        }
        const _message = new SiweMessage(message);
        const valid = await publicClient.verifyMessage({
            address: address as `0x${string}`,
            message: _message.prepareMessage(),
            signature: signature as `0x${string}`,
        });
        if (!valid) {
            throw boom.unauthorized('Invalid signature')
        }
        const newNonce = generateSignString(10);
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