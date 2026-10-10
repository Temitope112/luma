import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./utils/prisma.js";
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("✅ PostgreSQL connected");
        app.listen(env.PORT, () => {
            console.log(`🚀 Luma API running on http://localhost:${env.PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map