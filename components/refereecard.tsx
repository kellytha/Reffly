export default function RefereeCard({
  id,
  name,
  phone_number,
}: {
  id: number;
  name: string;
  phone_number: string;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4 border">
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-gray-600">📱 {phone_number}</p>

      <div className="flex gap-2 mt-4">
        <button className="bg-yellow-500 text-white px-3 py-1 rounded">
          Edit
        </button>
        <button className="bg-red-600 text-white px-3 py-1 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}