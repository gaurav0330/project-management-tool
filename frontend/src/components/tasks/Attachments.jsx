export default function Attachments({ files }) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Attachments</h3>
        {files.length === 0 ? (
          <p className="text-gray-500">No attachments available</p>
        ) : (
          <ul className="border rounded-lg p-2 bg-gray-50">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2">
                <span className="text-sm">{file.name} ({file.size})</span>
                <span className="text-xs text-gray-500">{file.type.toUpperCase()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  