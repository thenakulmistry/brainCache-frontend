import { useEffect, useRef } from "react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { api } from "../apiClient"
import { useNavigate } from "react-router-dom"
import { toast } from "../components/ui/Toast"

export const Signup = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.getItem("token") && navigate("/dashboard");
    }, [navigate]);

    async function signupHandler(e: React.FormEvent) {
        e.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try{
            await api.post(`/signup`, {username, password});
            navigate("/signin");
        } catch (error: any){
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Signup failed. Please try again.");
            }
        }
    }

    return (
        <div className="animated-gradient min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={signupHandler} className="flex flex-col items-center gap-4">
                <h1 className="text-3xl font-bold text-white mb-4">Sign Up</h1>
                <Input placeholder="Email/Username" ref={usernameRef}/>
                <Input placeholder="Password" type="password" ref={passwordRef} />
                <Button variant="primary" size="md" label="Sign Up" fullWidth={true} />
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-white mt-4">Already have an account?</span>
                    <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signin")}>Sign In</span>
                </div>
            </form>
        </div>
    )
}