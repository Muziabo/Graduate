import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            role: string;
            institutionId?: string;
        }
    }

    interface User {
        id: string;
        email: string;
        role: string;
        institutionId?: string;
        institutionName?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: string;
        institutionId?: string;
        institutionName?: string;
    }
}
