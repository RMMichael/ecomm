import { Request, Response, NextFunction } from "express";
import { allowedOrigins } from "../lib/Auth";

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.method === "GET") {
        console.log(typeof req.cookies, JSON.stringify(req.cookies));
        const token = req.cookies["session"] ?? null;
        console.log(`DEBUG: request.cookies: ${JSON.stringify(req.cookies)}`);
        if (token !== null) {
            // Only extend cookie expiration on GET requests since we can be sure
            // a new session wasn't set when handling the request.
            res.cookie("session", token, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 30,  // 30 days in milliseconds
                sameSite: "none",
                httpOnly: true,
                secure: true
            });

            console.log("middleware: session found and extended");
        }
        next();
        return;
    }

    // For non-GET requests, we verify the Origin header for CSRF protection

    console.log("headers:", JSON.stringify(req.headers));
    const originHeader = req.headers["origin"] ?? null;
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = req.headers["host"] ?? null;
    if (originHeader === null || hostHeader === null) {
        console.error("origin or host header is null");
        res.status(403).json({
            "status": "error",
            "message": "Forbidden"
        });
        return;
    }
    let originURL: URL;
    try {
        originURL = new URL(originHeader as any);
    } catch {
        console.error("origin header is not valid");
        res.status(403).json({
            "status": "error",
            "message": "Forbidden"
        });
        return;
    }
    if (!allowedOrigins.includes(originURL.origin)) {
        console.error("origin header does not match allowed headers", originURL.origin, allowedOrigins);
        res.status(403).json({
            "status": "error",
            "message": "Forbidden"
        });
        return;
    }

    next();
}
