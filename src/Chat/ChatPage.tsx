import { useParams } from "react-router-dom";
import Chat from "./Chat";

export default function ChatPage() {
  const { otherUserId } = useParams<{ otherUserId: string }>();

  if (!otherUserId) return <p>Invalid chat</p>;

  return (
    <div className="h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md h-full">
        <Chat otherUserId={otherUserId} />
      </div>
    </div>
  );
}
