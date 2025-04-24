import { LoginForm } from './_components/LoginForm';

export default function Login() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 py-6 bg-white rounded-lg shadow">
        <div>
          <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">Entrar</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
