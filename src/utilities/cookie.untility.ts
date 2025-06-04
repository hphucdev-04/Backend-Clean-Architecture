import { env } from "~/configs/env";

export interface ICookieOptions{
    maxAge:number;
    expires?:Date;
    domain?:string;
    secure?:boolean;
    httpOnly?:boolean;
    sameSite?:'strict' | 'lax' | 'none';
    path?:string;
}
export class CookieUntility{
    public static setCookie(res:Response,name:string,value:string,options?:ICookieOptions):void{
        const cookieOptions:ICookieOptions = {
            maxAge:env.cookie.maxAge,
            domain:env.cookie.domain,
            secure:env.cookie.secure,
            httpOnly:env.cookie.httpOnly,
            sameSite:env.cookie.sameSite,
            path:env.cookie.path,
        }
        const finalOptions = {...cookieOptions,...options};
        res.cookie(name,value,finalOptions);
    }
    public static setAccessTokenCookie(res:Response,token:string, expiresInSeconds:number):void{
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
        this.setCookie(res,env.cookie.accessTokenName,token,{
            maxAge:expiresInSeconds,
            expires:expiresAt,
        });
    }
}
