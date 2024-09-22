import AuthForm from "@/components/AuthForm";

function Login() {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="p-3 border border-slate-200 rounded-md max-w-80 shadow-lg">
          <AuthForm
            title="Login"
            footer="Belum Memiliki akun? Anda dapat|membuat akun baru"
            href="/register"
          />
        </div>
      </div>
    </>
  );
}

export default Login;
