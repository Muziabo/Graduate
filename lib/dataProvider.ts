import { fetchUtils, DataProvider } from 'ra-core';
import { getSession } from 'next-auth/react';

const apiUrl = process.env.POSTGREST_API_URL || "http://localhost:3000/api";
const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }
    return fetchUtils.fetchJson(url, options);
};

const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const session = await getSession();
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
        const { field, order } = params.sort || { field: '', order: '' };
        const query = {
            _sort: field,
            _order: order,
            _start: (page - 1) * perPage,
            _end: page * perPage,
            ...params.filter, // Pass any additional filters
        };

        const url = `${apiUrl}/${resource}?${new URLSearchParams(query)}`;

        const { headers, json } = await httpClient(url);

        // Filter data based on role and institution
        if (session?.user.role === 'INSTITUTION_ADMIN') {
            json.data = json.data.filter((item: any) => item.institutionId === session.user.institutionId);
        }

        return {
            data: json.data || json,
            total: json.total || (json.data || json).length, // Support both wrapped and unwrapped responses
        };
    },

    getOne: async (resource, params) => {
        const session = await getSession();
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url);

        // Filter data based on role and institution
        if (session?.user.role === 'INSTITUTION_ADMIN' && json.institutionId !== session.user.institutionId) {
            throw new Error('Unauthorized');
        }

        return {
            data: json.data || json,
        };
    },

    getMany: async (resource, params) => {
        const session = await getSession();
        const url = `${apiUrl}/${resource}?ids=${params.ids.join(",")}`;
        const { json } = await httpClient(url);

        // Filter data based on role and institution
        if (session?.user.role === 'INSTITUTION_ADMIN') {
            json.data = json.data.filter((item: any) => item.institutionId === session.user.institutionId);
        }

        return {
            data: json.data || json,
        };
    },

    getManyReference: async (resource, params) => {
        const session = await getSession();
        const url = `${apiUrl}/${resource}?${params.target}=${params.id}`;
        const { json } = await httpClient(url);

        // Filter data based on role and institution
        if (session?.user.role === 'INSTITUTION_ADMIN') {
            json.data = json.data.filter((item: any) => item.institutionId === session.user.institutionId);
        }

        return {
            data: json.data || json,
            total: (json.data || json).length,
        };
    },

    create: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url, {
            method: "POST",
            body: JSON.stringify(params.data),
        });

        return {
            data: json.data || json,
        };
    },

    update: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url, {
            method: "PUT",
            body: JSON.stringify(params.data),
        });

        return {
            data: json.data || json,
        };
    },

    delete: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url, { method: "DELETE" });

        return {
            data: json.data || json,
        };
    },

    updateMany: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const responses = await Promise.all(
            params.ids.map((id) =>
                httpClient(`${url}/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(params.data),
                })
            )
        );

        return {
            data: responses.map(({ json }) => json.id),
        };
    },

    deleteMany: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const responses = await Promise.all(
            params.ids.map((id) =>
                httpClient(`${url}/${id}`, { method: "DELETE" })
            )
        );

        return {
            data: responses.map(({ json }) => json.id),
        };
    },
};

export default dataProvider;