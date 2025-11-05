import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onClear: () => void;
}

const languageExtensions: { [key: string]: string } = {
  py: 'python',
  js: 'javascript',
  cpp: 'cpp',
  java: 'java',
  txt: 'text',
};

const getLanguage = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? languageExtensions[extension] : 'text';
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onClear }) => {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; language: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const language = getLanguage(file.name);
      onFileUpload(file);
      setFileInfo({ name: file.name, size: file.size, language });
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/python': ['.py'],
      'text/javascript': ['.js'],
      'text/cpp': ['.cpp'],
      'text/java': ['.java'],
      'text/plain': ['.txt'],
    }
  });

  const handleClear = () => {
    setFileInfo(null);
    onClear();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        {...getRootProps()}
        className={`w-full p-6 border-2 border-dashed rounded-lg cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-900/10' : 'border-gray-600 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-gray-300">Drop the files here ...</p>
        ) : (
          <p className="text-center text-gray-400">Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {fileInfo && (
        <div className="w-full p-4 bg-gray-800 rounded-lg text-sm">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>Name:</strong> {fileInfo.name}</p>
              <p><strong>Size:</strong> {fileInfo.size} bytes</p>
              <p><strong>Language:</strong> {fileInfo.language}</p>
            </div>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Clear File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;