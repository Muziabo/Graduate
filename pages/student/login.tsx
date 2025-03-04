"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const StudentLogin = () => {
    const searchParams = useSearchParams();
    const [institution, setInstitution] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const institutionParam = searchParams?.get("institution") || "";
        setInstitution(institutionParam);
    }, [searchParams]);

    interface FormElements extends HTMLFormControlsCollection {
        email: HTMLInputElement;
        studentId: HTMLInputElement;
    }

    interface SignInResult {
        error?: string;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const target = e.target as HTMLFormElement;
        const elements = target.elements as FormElements;

        const email = elements.email.value.trim();
        const studentID = elements.studentId.value.trim();

        if (!institution) {
            setError("Institution parameter missing in URL.");
            setLoading(false);
            return;
        }

        if (!email || !studentID) {
            setError("Please provide all required credentials.");
            setLoading(false);
            return;
        }

        try {
            const result = await signIn("student-login", {
                email,
                studentId: studentID,
                institution,
                redirect: false,
                callbackUrl: `/student/hero?institution=${encodeURIComponent(institution)}`,
            }) as SignInResult | undefined;

            setLoading(false);

            if (result?.error) {
                setError(result.error || "Invalid login credentials.");
            } else {
                router.push(`/student/hero?institution=${encodeURIComponent(institution)}`);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-cover bg-center shadow-sm px-4 md:px-0" style={{ backgroundImage: "url('/images/brown.jpg')" }}>
            <div className="flex flex-col justify-center px-6 py-10 md:w-1/2 h-auto shadow-lg rounded-xl md:rounded-none bg-white bg-opacity-70">
                <div className="max-w-lg mx-auto text-left">
                    <p className="text-center mb-4 text-gray-700">Graduands for</p>
                    <h3 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        {institution || "Your Institution"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="studentId" className="block text-sm font-medium text-gray-900">
                                Student ID
                            </label>
                            <input
                                type="text"
                                id="studentId"
                                name="studentId"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-red-500 text-white font-semibold shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Sign In"}
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;