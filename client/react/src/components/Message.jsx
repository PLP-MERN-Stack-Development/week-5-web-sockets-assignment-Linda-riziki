export default function Message({ msg }) {
  return (
    <div className="p-2 border rounded bg-gray-100">
      <p className="text-sm text-gray-700">
        <strong>{msg.sender}</strong> <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
      </p>
      <p>{msg.message}</p>
    </div>
  );
}
