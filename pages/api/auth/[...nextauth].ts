import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Import Prisma client
import bcrypt from "bcrypt";

export const authOptions = {
    session: {
        strategy: "jwt" as const, // Use "jwt" as a constant value for the session strategy
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "text" },
                institution: { label: "Institution", type: "text" }, // Only for student login
            },
            async authorize(credentials) {
                const { email, password, institution } = credentials || {};

                console.log("Received credentials:", { email, password, institution });

                if (!email || !password) {
                    console.log("Missing credentials");
                    return null;
                }

                // Check if it's a student login (student needs instAdmin parameter)
                if (institution) {
                    const student = await prisma.student.findUnique({
                        where: { email },
                        include: { Institution: true }, // Include instAdmin details
                    });

                    if (student && student.Institution.name === institution) {
                        // Validate the student ID for students
                        if (student.studentId === password) {
                            console.log("Student authenticated");
                            return {
                                id: student.id.toString(),
                                email: student.email,
                                institutionId: student.Institution.id,
                                institutionName: student.Institution.name,
                                role: "STUDENT",
                            };
                        } else {
                            console.log("Invalid student ID");
                        }
                    } else {
                        console.log("Student not found or instAdmin mismatch");
                    }
                }

                // Check if it's an admin login (admin is a User in the "User" model)
                const admin = await prisma.user.findUnique({
                    where: { email },
                });

                if (admin) {
                    // Validate the password for admins
                    if (admin.password && await bcrypt.compare(password, admin.password)) {
                        console.log("Admin authenticated");
                        return {
                            id: admin.id.toString(),
                            email: admin.email,
                            role: admin.role,
                        };
                    } else {
                        console.log("Invalid admin password");
                    }
                }

                console.log("Authentication failed");
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user?: any }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                token.institutionId = user.institutionId || null;
                token.institutionName = user.institutionName || null;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.role = token.role;
            session.user.institutionId = token.institutionId;
            session.user.institutionName = token.institutionName;
            return session;
        },
    },
    pages: {
        signIn: "/student/login", // Default to student login page
        adminSignIn: "/admin/login", // Admin login page
    },
};

export default NextAuth(authOptions);