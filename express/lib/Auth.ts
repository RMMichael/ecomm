import {query, pool} from '../pg/queries';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { User, Session} from "../schemas/DataObjects";
import { prisma } from '../pg/queries';
import * as PrismaClient from "../generated/prisma"
import { Prisma } from '../generated/prisma';

export const allowedOrigins = [process.env.FRONTEND_ORIGIN];

export class Auth {

    static generateSessionToken(): string {
        const bytes = new Uint8Array(20);
        crypto.getRandomValues(bytes);
        const token = encodeBase32LowerCaseNoPadding(bytes);
        return token;
    }

    static async createSession(token: string, userId: number): Promise<Session> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const session: Session = {
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        };
        await prisma.$executeRawUnsafe(
            `INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)`,
            session.id, session.userId, session.expiresAt
        );
        return session;
    }

    static async validateSessionToken(token: string): Promise<SessionValidationResult> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        // const result = await prisma.$queryRaw<Array<PrismaClient.Session & {name: string }>>`
        //   SELECT s.id as session_id, s.user_id, s.expires_at, u.name
        //   FROM sessions as s
        //   INNER JOIN users as u ON s.user_id = u.id
        //   WHERE s.id = ${sessionId}
        // `;
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                user: true,
            }
        });

        if (session === null) {
            console.error(`no session found for token: ${token}`);
            return {session: null, user: null};
        }

        if (Date.now() >= session.expiresAt.getTime()) {
            await prisma.$executeRawUnsafe(
                "DELETE FROM sessions WHERE id = $1", sessionId);
            return {session: null, user: null};
        }
        if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
            session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
            const sql = `UPDATE sessions SET expires_at = $1 WHERE id = $2`;
            await prisma.$executeRawUnsafe(sql, session.expiresAt, session.id);
        }
        return {session, user: session.user};
    }

    static async invalidateSession(sessionId: string): Promise<boolean> {
        const result = await prisma.$executeRawUnsafe(
            `DELETE FROM sessions WHERE id = $1`, sessionId);
        console.log("invalidateSession result", result);
        return result === 1;

    }

    static async invalidateAllSessions(userId: number): Promise<void> {
        await prisma.$executeRawUnsafe("DELETE FROM sessions WHERE user_id = $1", userId);
    }

    static async getUserSessions(userId: number): Promise<Session[]> {
        const result = await prisma.$queryRawUnsafe<PrismaClient.Session[]>(
            "SELECT FROM sessions WHERE user_id = $1",
            userId
        );
        return result;
    }

    static async getAllSessions() {
        // const result = await pool.query("SELECT *, user_session.id as session_id FROM user_session JOIN users ON user_session.user_id = users.id");
        const result = await prisma.$queryRawUnsafe<
            Array<PrismaClient.Session & PrismaClient.User>
        >(`
          SELECT sessions.*, sessions.id as session_id, users.*
          FROM sessions
          JOIN users ON sessions.user_id = users.id`);
        //
        // 	"0": {
        // 		"id": 1,
        // 		"user_id": 1,
        // 		"expires_at": "2025-07-01T22:43:28.081Z",
        // 		"google_id": "google_id_1",
        // 		"email": "rickmikegull@email.com",
        // 		"name": "rick",
        // 		"picture": "picture_url",
        // 		"session_id": "012345"
        // 	}
        // }
        return result;
    }
}
type SessionValidationResult =
| { session: Session; user: User }
| { session: null; user: null} ;
// export interface Session {
//     id: string;
//     userId: number;
//     expiresAt: Date;
// }
//
// export interface User {
//     id: number;
// }



