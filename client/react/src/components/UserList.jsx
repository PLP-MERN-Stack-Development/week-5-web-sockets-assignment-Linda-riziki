export default function UserList({ users }) {
  return (
    <div className="bg-gray-100 border-r p-4 space-y-2 overflow-y-auto">
      <h2 className="font-semibold text-lg mb-2">Online Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="text-green-600">{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
