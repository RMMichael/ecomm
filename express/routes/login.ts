const express = require('express');
const router = express.Router();
import { query, pool } from "../pg/queries";
import { Auth } from "../lib/Auth";
import { User } from "../schemas/DataObjects";

const dbQueryUsername = async (username: string): Promise<User | null> => {
    const result = await query("SELECT * FROM users WHERE name = $1", [username]);
    if (result.rows.length === 0) {
        console.error(`no user found: ${username}`);
        return null;
    }
    const parseUser = User.safeParse(result.rows[0]);
    if (!parseUser.success) {
        console.error(parseUser.error);
        return null;
    }

    return parseUser.data;
}

// adapting from https://lucia-auth.com/tutorials/google-oauth/nextjs#validate-callback
// app/login/google/callback/route.ts
router.post('/', async function(req: any, res: any, next: any) {
    // const url = new URL(req.url, `http://${req.headers.host}`);
    // const username = url.searchParams.get("username") ?? "";
    console.log("login post request body:", JSON.stringify(req.body));
    const { username } = req.body;

    console.log(`retrieving user: ${username}`);
    const existingUser = await dbQueryUsername(username);
    console.log(JSON.stringify(existingUser));

    if (existingUser === null) {
        res.json({
            "error": {
                "code": 404,
                "message": `User "${username}" not found`,
            },
        });
        return;
    }

    const sessionToken = Auth.generateSessionToken();
    const session = await Auth.createSession(sessionToken, existingUser.id);
    // await Auth.setSessionTokenCookie(res, sessionToken, session.expiresAt);
    res.cookie('session', sessionToken, {
        httpOnly: true,
        sameSite: 'none',
        expires: session.expiresAt,
        path: '/',
        secure: true,
    });
    res.json(existingUser);

    console.log(`session set:`, sessionToken);

    next();
});

export default router;
