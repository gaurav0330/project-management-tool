import React from "react";
import { FaDownload, FaTrash } from "react-icons/fa";

const AttachmentList = ({ files, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Attachments</h3>
      {files.length === 0 ? <p className="text-gray-500">No files uploaded yet.</p> : null}
      {files.map((file, index) => (
        <div key={index} className="flex justify-between items-center border p-2 rounded mt-2">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div className="flex space-x-2">
            <button className="text-blue-500">
              <FaDownload />
            </button>
            <button className="text-red-500" onClick={() => onDelete(index)}>
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
