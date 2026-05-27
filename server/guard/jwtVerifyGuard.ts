import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const auth = request.get('authorization');

        if (!auth) return false;

        const secret = process.env.TOKEN_SECRET;
        if (!secret) throw new Error("Token secret not defined");

        // remove if not bearer
        const token = auth.split(' ')[1];

        try {
            const payload = jwt.verify(token, secret);
            request.user = payload;
            return true;
        } catch (er) {
            throw new UnauthorizedException({
                success: false,
                message: "Unauthorized access"
            })
        }
    }
}