import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';
import ApiService from '../../services/api.service';

export default function PDFUpload({ clientId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', clientId);

      const response = await ApiService.uploadPortfolioPDF(formData, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Portfolio uploaded successfully",
        });
        if (onSuccess) onSuccess(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload portfolio",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      setFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
          disabled={uploading}
        />
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <span className="text-sm text-gray-600">
            {file ? file.name : "Click to upload or drag and drop"}
          </span>
          <span className="text-xs text-gray-500 mt-1">PDF files only</span>
        </label>
      </div>

      {file && !uploading && (
        <Button
          onClick={handleUpload}
          className="w-full"
        >
          Upload Portfolio
        </Button>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-gray-600">
            Uploading... {progress}%
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
        <p>
          Please ensure your PDF contains the complete portfolio statement. 
          The system will analyze the document and extract relevant investment details.
        </p>
      </div>
    </div>
  );
}
