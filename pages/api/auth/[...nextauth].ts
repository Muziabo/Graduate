import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            email: string;
            role: string;
            institutionId?: string;
        } & DefaultSession["user"]
    }

    interface JWT {
        id: string;
        role?: string;
        institutionId?: string;
        institutionName?: string;
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "text" },
                institution: { label: "Institution", type: "text" },
            },
            async authorize(credentials) {
                const { email, password, institution } = credentials || {};

                if (!email || !password) {
                    throw new Error("Missing credentials");
                }

                // Student login flow
                if (institution) {
                    const student = await prisma.student.findUnique({
                        where: { email },
                        include: { Institution: true },
                    });

                    if (!student || student.Institution.name !== institution) {
                        throw new Error("Student not found or institution mismatch");
                    }

                    if (student.studentId !== password) {
                        throw new Error("Invalid student ID");
                    }

                    return {
                        id: student.id.toString(),
                        email: student.email,
                        role: "STUDENT",
                        institutionId: student.Institution.id,
                        institutionName: student.Institution.name,
                    };
                }

                // Admin login flow
                const admin = await prisma.user.findUnique({
                    where: { email },
                    include: { institution: true },
                });

                if (!admin || !admin.password) {
                    throw new Error("Admin not found");
                }

                const isValidPassword = await bcrypt.compare(password, admin.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                return {
                    id: admin.id.toString(),
                    email: admin.email,
                    role: admin.role,
                    institutionId: admin.institutionId || undefined,
                };
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
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.institutionId = token.institutionId;
            }
            return session;
        },
    },
    pages: {
        signIn: "/student/login",
    },
};

export default NextAuth(authOptions);
