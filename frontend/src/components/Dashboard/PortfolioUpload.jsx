import { useState } from 'react';
import { CloudUploadIcon } from '@heroicons/react/outline';

export default function PortfolioUpload({ onUploadComplete, selectedClient }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // For now, simulate an upload with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const mockResponse = {
        success: true,
        data: {
          // This matches our existing sampleReport structure
          allocation: {
            Equity: 600000,
            Debt: 300000,
            Gold: 100000
          },
          fund_performance: [
            { name: "HDFC Flexi Cap", xirr: 13.2 },
            { name: "Axis Bluechip", xirr: 9.5 },
            { name: "SBI Gold Fund", xirr: 7.1 }
          ],
          // ... other data would go here
        }
      };

      onUploadComplete(mockResponse.data);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        {selectedClient ? (
          <>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              Upload Portfolio Statement
              <span className="block text-sm text-blue-600">for {selectedClient.name}</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload your client's CAMS e-CAS PDF file to analyze their portfolio
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              Select a Client
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Please select a client from the list above to upload their portfolio statement
            </p>
          </>
        )}
      </div>

      <div className="mt-6">
        <label className="block">
          <span className="sr-only">Choose file</span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={`block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              ${selectedClient 
                ? 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                : 'file:bg-gray-50 file:text-gray-400'
              }
              disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isUploading || !selectedClient}
          />
        </label>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {file && (
          <p className="mt-2 text-sm text-gray-500">
            Selected file: {file.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || isUploading || !selectedClient}
          className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${!file || isUploading || !selectedClient
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading 
            ? 'Uploading...' 
            : !selectedClient
              ? 'Select a Client First'
              : 'Upload and Analyze'}
        </button>
      </div>
    </div>
  );
}
