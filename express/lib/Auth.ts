import {query, pool} from '../pg/queries';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { User, Session} from "../schemas/DataObjects";
import { prisma } from '../pg/queries';

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
        await prisma.$executeRaw`
          INSERT INTO user_session (id, user_id, expires_at)
          VALUES (${session.id}, ${session.userId}, ${session.expiresAt})
        `;
        return session;
    }

    static async validateSessionToken(token: string): Promise<SessionValidationResult> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const result = await prisma.$queryRaw<Array<{
            session_id: string;
            user_id: string;
            expires_at: Date;
            name: string;
        }>>`
          SELECT s.id as session_id, s.user_id, s.expires_at, u.name
          FROM user_session as s
          INNER JOIN users as u ON s.user_id = u.id
          WHERE s.id = ${sessionId}
        `;

        if (result.length === 0) {
            console.error(`no session found for token: ${token}`);
            return {session: null, user: null};
        }
        const row = result[0];
        console.log("row: ", JSON.stringify(row));

        const session: Session = {
            id: row["session_id"],
            userId: row["user_id"],
            expiresAt: row["expires_at"],
        };
        const user: User = {
            id: row["user_id"],
            name: row["name"],
            email: row["email"],
            googleId: "",
            picture: "",
        }
        if (Date.now() >= session.expiresAt.getTime()) {
            await prisma.$executeRaw`
              DELETE FROM user_session WHERE id = ${session.id}
            `;
            return {session: null, user: null};
        }
        if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
            session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
            await prisma.$executeRaw`
              UPDATE user_session SET expires_at = ${session.expiresAt} WHERE id = ${session.id}
            `;
        }
        return {session, user};
    }

    static async invalidateSession(sessionId: string): Promise<boolean> {
        const result = await prisma.$executeRaw`
          DELETE FROM user_session WHERE id = ${sessionId}
        `;
        console.log("invalidateSession result", result);
        return result === 1;

    }

    static async invalidateAllSessions(userId: number): Promise<void> {
        await prisma.$executeRaw`
          DELETE FROM user_session WHERE user_id = ${userId}
        `;
    }

    static async getUserSessions(userId: number): Promise<User[]> {
        const result = await pool.query("SELECT FROM user_session WHERE user_id = $1", [userId]);
        return result.rows;
    }

    static async getAllSessions() {
        // const result = await pool.query("SELECT *, user_session.id as session_id FROM user_session JOIN users ON user_session.user_id = users.id");
        const result = await prisma.$queryRaw<
            Array<{
                session_id: string;
                id: string;
                user_id: string;
                expires_at: Date;
                google_id: string;
                email: string;
                name: string;
                picture: string;
            }>
        >`
          SELECT user_session.*, user_session.id as session_id, users.*
          FROM user_session
          JOIN users ON user_session.user_id = users.id
        `;
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



