import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { useToast } from '../../components/ui/use-toast';
import ApiService from '../../services/api.service';
import { useClients } from '../../contexts/ClientContext';

export default function UploadPortfolioDialog({ open, onOpenChange }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { addClient } = useClients();

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

      const response = await ApiService.uploadPortfolioPDF(formData, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });

      if (response.success && response.data) {
        // Create new client with portfolio data
        const { client, funds, summary } = response.data;
        const newClient = await addClient({
          name: client.name,
          email: client.email,
          panNumber: client.pan,
          portfolioData: {
            funds,
            summary,
            lastUpdated: new Date().toISOString()
          }
        });

        toast({
          title: "Success",
          description: "Portfolio uploaded and client created successfully",
        });

        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process portfolio",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Portfolio Statement</DialogTitle>
          <DialogDescription>
            Upload a CAMS consolidated account statement to create a new client profile.
          </DialogDescription>
        </DialogHeader>

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

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                Processing... {progress}%
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            {file && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Upload & Create Client'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
