import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface AuthUser {
    id: string;
    email: string;
    role: string;
    institutionId?: string;
    institutionName?: string;
}

// Helper functions for authentication
async function handleStudentLogin(email: string, studentId: string, institution: string): Promise<AuthUser | null> {
    try {
        // First find the institution
        const institutionRecord = await prisma.institution.findFirst({
            where: { 
                name: institution,
                isActive: true
            }
        });

        if (!institutionRecord) {
            console.log("Institution not found or inactive:", institution);
            throw new Error("Institution not found or inactive");
        }

        // Then find the student with matching email and institution
        const student = await prisma.student.findFirst({
            where: { 
                email: email,
                InstitutionId: institutionRecord.id,
                studentId: studentId
            },
            include: { 
                Institution: true 
            }
        });

        if (!student) {
            console.log("Student not found for email and institution:", email, institution);
            throw new Error("Invalid student credentials");
        }

        return {
            id: student.id.toString(),
            email: student.email,
            role: "STUDENT",
            institutionId: student.Institution.id.toString(),
            institutionName: student.Institution.name,
        };
    } catch (error) {
        console.error("Error in handleStudentLogin:", error);
        throw error;
    }
}

async function handleAdminLogin(email: string, password: string): Promise<AuthUser | null> {
    try {
        const admin = await prisma.user.findUnique({
            where: { email },
            include: { institution: true },
        });

        if (!admin || !admin.password) {
            console.log("Admin not found");
            throw new Error("Invalid admin credentials");
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            console.log("Invalid admin password");
            throw new Error("Invalid admin credentials");
        }

        return {
            id: admin.id.toString(),
            email: admin.email,
            role: admin.role,
            institutionId: admin.institutionId?.toString(),
            institutionName: admin.institution?.name,
        };
    } catch (error) {
        console.error("Error in handleAdminLogin:", error);
        throw error;
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            id: "admin-login",
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Missing credentials");
                    }
                    return await handleAdminLogin(credentials.email, credentials.password);
                } catch (error) {
                    console.error("Admin auth error:", error);
                    throw error;
                }
            },
        }),
        CredentialsProvider({
            id: "student-login",
            name: "Student Login",
            credentials: {
                email: { label: "Email", type: "text" },
                studentId: { label: "Student ID", type: "text" },
                institution: { label: "Institution", type: "text" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.studentId || !credentials?.institution) {
                        throw new Error("Missing credentials");
                    }
                    return await handleStudentLogin(
                        credentials.email,
                        credentials.studentId,
                        credentials.institution
                    );
                } catch (error) {
                    console.error("Student auth error:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                token.institutionId = user.institutionId;
                if ('institutionName' in user) {
                    token.institutionName = user.institutionName;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email || '';
                session.user.role = token.role || '';
                session.user.institutionId = token.institutionId;
                if (token.institutionName) {
                    session.user.institutionName = token.institutionName;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/student/login",
        error: "/auth/error",
    },
    debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
