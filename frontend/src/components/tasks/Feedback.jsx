export default function Feedback() {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Feedback</h3>
        <textarea
          placeholder="Add your feedback here..."
          className="w-full p-2 border rounded-lg"
        ></textarea>
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg">✔ Approve</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">⚠ Request Changes</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg">✖ Reject</button>
        </div>
      </div>
    );
  }
  