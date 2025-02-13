import { signIn } from "next-auth/react";

const Login = () => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = (e.target as any).email.value;
        const password = (e.target as any).password.value;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/", // Redirect users after successful login
        });

        if (result?.error) {
            alert("Invalid email or password.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;