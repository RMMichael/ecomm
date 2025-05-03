import type { NextConfig } from "next";

import dotenv from 'dotenv';

dotenv.config();


const nextConfig: NextConfig = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    output: 'export',
  /* config options here */
};

export default nextConfig;
