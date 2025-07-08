import { useEffect } from "react";
import { useAuth } from "../../context/auth-context";
import { useNavigate } from "@tanstack/react-router";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const fakeToken = "demo-token-123";
    login(fakeToken);

    setTimeout(() => {
      navigate({ to: "/" });
    }, 10);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated]);

  return (
    <div className="w-full relative h-full">
      {/* <h1>Login</h1> */}
      <button onClick={handleLogin} className=" absolute top1/2 left-1/2 mt-40 -translate-y-1/2 -translate-x-1/2 w-40 text-xl bg-primary-200 border-2 rounded-lg border-primary-main hover:bg-primary-400 duration-200">وارد شودن.</button>
    </div>
  );
}
