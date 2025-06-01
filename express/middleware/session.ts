import { Request, Response, NextFunction } from "express";
import { allowedOrigins, Auth } from "../lib/Auth";

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies["session"] ?? null;
    if (token !== null) {
        console.log("retrieving session token", token);
        const result = await Auth.validateSessionToken(token);
        console.log("session result:", JSON.stringify(result));

        req.session = result.session ?? undefined;
        req.user = result.user ?? undefined;
    }

    // For non-GET requests, we verify the Origin header for CSRF protection
    if (req.method !== "GET") {
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
    }

    next();
}
