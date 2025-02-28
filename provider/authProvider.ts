import { getSession, signIn, signOut } from 'next-auth/react';

export default {
    login: async ({ username, password }: { username: string; password: string }) => {
        const session = await getSession();
        if (!session) {
            const result = await signIn('credentials', { redirect: false, username, password });
            if (result?.error) {
                throw new Error(result.error);
            }
        }
        return Promise.resolve();
    },
    logout: async () => {
        await signOut({ redirect: false });
        return Promise.resolve();
    },
    checkAuth: async () => {
        const session = await getSession();
        return session ? Promise.resolve() : Promise.reject();
    },
    checkError: (error: any) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: async () => {
        const session = await getSession();
        return session && session.user ? Promise.resolve(session.user.role) : Promise.reject();
    },
};
