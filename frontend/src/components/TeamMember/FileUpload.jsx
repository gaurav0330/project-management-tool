import React, { useState } from "react";

const FileUpload = ({ onFileUpload }) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    onFileUpload(files);
  };

  return (
    <div
      className={`border-2 border-dashed p-6 text-center ${
        dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <p>Drag and drop your files here, or click to browse</p>
      <p className="text-gray-500 text-sm">Maximum file size: 10MB</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Upload Files</button>
    </div>
  );
};

export default FileUpload;
