import { env } from "~/configs/env";
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from "~/exceptions/http.exception";

export interface IPayLoad{
    id: string; 
    role:string;
    type?: 'access' | 'refresh';
    iat?:number;
    exp?:number;
}

export interface IToken{
    token:string;
    expiresIn:number;
}

export class JwtUntility{
    public static generateAccessToken(userId: string,role:string): IToken{
        const expiresInSeconds = this.parseExpiresIn(env.jwt.expiresIn);
        const payload:IPayLoad = {
            id:userId,
            role:role,
            type:'access',
            iat:Math.floor(Date.now()/1000),
        }
        const options:jwt.SignOptions = {
            expiresIn:expiresInSeconds,
            algorithm:env.jwt.algorithm as jwt.Algorithm,
            issuer:env.jwt.issuer,
            audience:env.jwt.audience,
        }
        const token = jwt.sign(payload,env.jwt.secret,options);
        
        return {
            token,      
            expiresIn:expiresInSeconds,
        }
    }
    public static generateRefreshToken(userId: string,role:string): IToken{
        const expiresInSeconds = this.parseExpiresIn(env.jwt.refreshExpiresIn);
        const payload:IPayLoad = {
            id:userId,
            role:role,
            type:'refresh',
            iat:Math.floor(Date.now()/1000),
        }
        const options:jwt.SignOptions = {
            expiresIn:expiresInSeconds,
            algorithm:env.jwt.algorithm as jwt.Algorithm,
        }
        const token = jwt.sign(payload,env.jwt.refreshSecret,options);
        return {
            token,
            expiresIn:expiresInSeconds,
        }
    }
    public static verifyAccessToken(token:string):IPayLoad{
        try {
            const decoded = jwt.verify(token,env.jwt.secret,{
                algorithms:[env.jwt.algorithm as jwt.Algorithm],
                issuer:env.jwt.issuer,
                audience:env.jwt.audience,
            }) as IPayLoad;
            if(decoded.type !== 'access'){
                throw new UnauthorizedException('Invalid token type');
            }
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException('Access token expired');
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException('Invalid access token');
            }
            throw new UnauthorizedException('Invalid access token');
        }
    }
    public static verifyRefreshToken(token:string):IPayLoad{
        try {
            const decoded = jwt.verify(token,env.jwt.refreshSecret,{
                algorithms:[env.jwt.algorithm as jwt.Algorithm],
                issuer:env.jwt.issuer,
                audience:env.jwt.audience,
            }) as IPayLoad;
            if(decoded.type !== 'refresh'){
                throw new UnauthorizedException('Invalid token type');
            }
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException('Refresh token expired');
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
    private static parseExpiresIn(expiresIn: string): number {
		const unit = expiresIn.slice(-1);
		const value = parseInt(expiresIn.slice(0, -1), 10);

		switch (unit) {
			case 'd': // days
				return value * 24 * 60 * 60;
			case 'h': // hours
				return value * 60 * 60;
			case 'm': // minutes
				return value * 60;
			case 's': // seconds
				return value;
			default: // assume seconds if no unit
				return parseInt(expiresIn, 10);
		}
	}
}
