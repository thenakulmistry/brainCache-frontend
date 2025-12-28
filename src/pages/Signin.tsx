import { useEffect, useRef } from "react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { BACKEND_URL } from "../config"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "../components/ui/Toast";

export const Signin = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.getItem("token") && navigate("/dashboard");
    }, [navigate]);

    async function signinHandler(e: React.FormEvent) {
        e.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, { username, password })
            if (response){
                const jwt = response.data.token;
                localStorage.setItem("token", jwt);
                navigate("/dashboard");
            }
        } catch (error){
            console.error("Signin failed:", error);
            toast.error("Signin failed. Please check your credentials");
        }
    }

    return (
        <div className="animated-gradient min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={signinHandler} className="flex flex-col items-center gap-4">
                <h1 className="text-3xl font-bold text-white mb-4">Sign In</h1>
                <Input placeholder="Email" ref={usernameRef} />
                <Input placeholder="Password" type="password" ref={passwordRef} />
                <Button variant="primary" size="md" label="Sign In" fullWidth={true} />
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-white mt-4">Create an account?</span>
                    <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span>
                </div>
            </form>
        </div>
    )
}