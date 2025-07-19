export default function TypingIndicator({ users }) {
  if (users.length === 0) return null;

  return (
    <div className="text-sm italic text-gray-500">
      {users.join(', ')} {users.length > 1 ? 'are' : 'is'} typing...
    </div>
  );
}
