import { useState } from "react";
import { useAppDispatch } from "../../../store/store";
import { createUser, updateUser } from "../usersSlice";
import { successAlert, errorAlert } from "../../../utils/alerts";


interface UserFormProps {
  user?: {
    id?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  onClose: () => void;
}

export default function UserForm({ user, onClose }: UserFormProps) {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "ProjectManager" | "User">(
    (user?.role as any) || "User"
  );
  const [error] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    let res;

    if (user?.id) {
      res = await dispatch(updateUser({ id: user.id, fullName, email, phoneNumber, role }));
    } else {
      res = await dispatch(createUser({ username, fullName, email, phoneNumber, password, role }));
    }

    if (updateUser.fulfilled.match(res) || createUser.fulfilled.match(res)) {
      successAlert(user ? "User updated successfully!" : "User created successfully!");
      onClose();
    } else {
      errorAlert("Failed to save user.");
    }
  } catch {
    errorAlert("Something went wrong.");
  }
};
  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Create User"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!user && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "Admin" | "ProjectManager" | "User")
          }
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="Admin">Admin</option>
          <option value="ProjectManager">Project Manager</option>
          <option value="User">User</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {user ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
