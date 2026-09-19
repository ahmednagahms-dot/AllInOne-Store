import LoginBanner from "../components/auth/LoginBanner";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-white">
      <LoginBanner />
      <LoginForm />
    </div>
  );
}