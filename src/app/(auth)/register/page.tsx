import AuthForm from "@/components/AuthForm";

function Register() {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="p-3 border border-slate-200 rounded-md max-w-80 shadow-lg">
          <AuthForm
            title="Register"
            footer="Sudah Memiliki akun? Anda dapat|masuk ke akun anda"
            href="/login"
          />
        </div>
      </div>
    </>
  );
}

export default Register;
