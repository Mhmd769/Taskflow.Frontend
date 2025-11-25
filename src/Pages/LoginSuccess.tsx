import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function LoginSuccess() {
  // Get user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">🎉 Success!</h1>
        {user ? (
          <>
            <p className="text-gray-700 text-lg mb-2">
              Hello, <span className="font-semibold">{user.email}</span>!
            </p>
            <p className="text-gray-500 text-sm mb-4">{user.email}</p>
          </>
        ) : (
          <p className="text-gray-700 text-lg mb-4">Hello, your login is placed successfully.</p>
        )}

        <Link
          to="/logout"
          className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
