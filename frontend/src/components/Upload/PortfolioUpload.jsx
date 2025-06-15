import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Upload, File, Check, AlertCircle } from 'lucide-react';
import ApiService from '../../services/api.service';
import { useToast } from '../ui/use-toast';

export default function PortfolioUpload({ isOpen, onClose, clientId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await ApiService.uploadPortfolio(clientId, formData);
      
      if (response.success) {
        setUploadStatus('success');
        toast({
          title: "Upload successful",
          description: "Portfolio data has been uploaded successfully",
        });
        setTimeout(() => {
          onClose();
          setFile(null);
          setUploadStatus(null);
        }, 1500);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload portfolio data",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Portfolio PDF</DialogTitle>
          <DialogDescription>
            Upload a PDF file containing the portfolio data for analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200
              ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <File className="h-6 w-6 text-primary" />
                <span className="font-medium text-primary">{file.name}</span>
              </div>
            ) : (
              <div>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Click to select a PDF file</p>
                <p className="text-xs text-muted-foreground">or drag and drop here</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
              <Check className="h-4 w-4" />
              Upload successful!
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              Upload failed. Please try again.
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="ml-2"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
