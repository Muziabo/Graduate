import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = (e.target as any).email.value;
        const password = (e.target as any).password.value;

        console.log("Submitting login form:", { email, password });

        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/admin/dashboard", // Admin Gowns
        });

        setLoading(false);

        if (result?.error) {
            console.log("Login error:", result.error);
            setError("Invalid email or password.");
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg bg-white max-w-md w-full space-y-4">
                <h1 className="text-2xl font-bold text-center text-[#01689c]">Admin Login</h1>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Admin Email"
                        className="border p-2 w-full rounded-lg"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        className="border p-2 w-full rounded-lg"
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    className={`bg-[#01689c] text-white px-4 py-2 w-full rounded-md ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;