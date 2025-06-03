import {query, pool} from '../pg/queries';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { User, Session} from "../schemas/DataObjects";

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
        await pool.query(
            "INSERT INTO user_session (id, user_id, expires_at) VALUES ($1, $2, $3)",
            [session.id,
                session.userId,
                session.expiresAt]
        );
        return session;
    }

    static async validateSessionToken(token: string): Promise<SessionValidationResult> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const result = await pool.query(
            `SELECT s.id as session_id, s.user_id, s.expires_at, u.name
            FROM user_session as s INNER JOIN users as u ON s.user_id = u.id
            WHERE s.id = $1`,
            [sessionId]
        );
        if (result.rows.length === 0) {
            console.error(`no session found for token: ${token}`);
            return {session: null, user: null};
        }
        const row = result.rows[0];
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
            await pool.query("DELETE FROM user_session WHERE id = $1", [session.id]);
            return {session: null, user: null};
        }
        if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
            session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
            await pool.query(
                "UPDATE user_session SET expires_at = $1 WHERE id = $2",
                [session.expiresAt, session.id]
            );
        }
        return {session, user};
    }

    static async invalidateSession(sessionId: string): Promise<boolean> {
        const result = await pool.query("DELETE FROM user_session WHERE id = $1", [sessionId]);
        console.log("invalidateSession result", result);
        return (result.rowCount !== null) && (result.rowCount > 0);

    }

    static async invalidateAllSessions(userId: number): Promise<void> {
        await pool.query("DELETE FROM user_session WHERE user_id = $1", [userId]);
    }

    static async getUserSessions(userId: number): Promise<User[]> {
        const result = await pool.query("SELECT FROM user_session WHERE user_id = $1", [userId]);
        return result.rows;
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



