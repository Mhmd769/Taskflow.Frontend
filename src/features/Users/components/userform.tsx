import { useState } from "react";
import { useAppDispatch, } from "../../../store/store";
import { createUser, updateUser } from "../usersSlice";

interface UserFormProps {
  user?: {
    id?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  onClose: () => void; // callback to close modal/form
}

export default function UserForm({ user, onClose }: UserFormProps) {
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [role, setRole] = useState<"Admin" | "ProjectManager" | "User">("User");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.id) {
        // update existing user
        await dispatch(updateUser({ id: user.id, fullName, email, phoneNumber, role }));
      } else {
        // create new user
        await dispatch(createUser({
            fullName, email, phoneNumber, role,
            id: ""
        }));
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Create User"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        onChange={(e) => setRole(e.target.value as "Admin" | "ProjectManager" | "User")}
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
