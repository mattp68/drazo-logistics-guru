import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (data: { email: string; password: string }) => {
    // TODO: Implement actual authentication
    console.log("Auth data:", data);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">DRAZO</h1>
          <p className="text-gray-600">Intelligent Logistics Solutions</p>
        </div>

        <AuthForm type={isSignIn ? "signin" : "signup"} onSubmit={handleAuth} />

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-primary hover:text-primary-dark"
          >
            {isSignIn ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;