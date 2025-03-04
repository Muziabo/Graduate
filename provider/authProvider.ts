import { getSession, signIn, signOut } from 'next-auth/react';

interface ErrorResponse {
    status?: number;
    message?: string;
}

export default {
    login: async ({ username, password, isAdmin }: { username: string; password: string; isAdmin?: boolean }) => {
        try {
            // Clear any existing session first
            await signOut({ redirect: false });

            // Determine the credentials type based on isAdmin
            const credentials = isAdmin
                ? { email: username, password }
                : { email: username, password, institution: password }; // For students, password field contains studentId

            const result = await signIn('credentials', {
                redirect: false,
                ...credentials
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Verify the session after login
            const session = await getSession();
            if (!session) {
                throw new Error('Failed to establish session');
            }

            // Verify correct role
            if (isAdmin && session.user.role !== 'ADMIN' && session.user.role !== 'INSTITUTION_ADMIN') {
                await signOut({ redirect: false });
                throw new Error('Invalid admin credentials');
            }

            if (!isAdmin && session.user.role !== 'STUDENT') {
                await signOut({ redirect: false });
                throw new Error('Invalid student credentials');
            }

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    logout: async () => {
        await signOut({ redirect: false });
        return Promise.resolve();
    },
    checkAuth: async () => {
        const session = await getSession();
        if (!session) {
            return Promise.reject();
        }

        // Check if we're in an admin route
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        const isAdminUser = session.user.role === 'ADMIN' || session.user.role === 'INSTITUTION_ADMIN';
        const isStudentUser = session.user.role === 'STUDENT';

        // Ensure admin routes are only accessible by admin users
        if (isAdminRoute && !isAdminUser) {
            await signOut({ redirect: false });
            return Promise.reject();
        }

        // Ensure student routes are only accessible by student users
        if (!isAdminRoute && !isStudentUser) {
            await signOut({ redirect: false });
            return Promise.reject();
        }

        return Promise.resolve();
    },
    checkError: (error: ErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: async () => {
        const session = await getSession();
        return session && session.user ? Promise.resolve(session.user.role) : Promise.reject();
    },
};
