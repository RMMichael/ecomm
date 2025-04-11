// from https://github.com/vercel/turborepo/blob/main/examples/kitchen-sink/apps/api/src/server.ts
import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";

export const createServer = (): Express => {
    const app = express();
    app
        .disable("x-powered-by")
        .use(morgan("dev"))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cors())
        .get("/message/:name", (req, res) => {
            res.json({ message: `helloooooo ${req.params.name}` });
            return;
        })
        .get("/status", (_, res) => {
            res.json({ ok: true });
            return;
        });

    return app;
};

// from https://github.com/vercel/turborepo/blob/main/examples/kitchen-sink/apps/api/src/index.ts
// import { log } from "@repo/logger";
// import { createServer } from "./server";

const port = process.env.PORT || 5001;
const server = createServer();

server.listen(port, () => {
    console.log(`api running on ${port}`);
});
