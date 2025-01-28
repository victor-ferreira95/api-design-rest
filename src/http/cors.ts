import type { CorsOptions } from "cors";

export const defaultCorsOptions: CorsOptions = {
    //origin: "http://localhost:3000",
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}