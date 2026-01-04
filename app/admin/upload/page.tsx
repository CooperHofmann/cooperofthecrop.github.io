'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Category, UploadProgress } from '@/lib/supabase/types';

const categories: { value: Category; label: string }[] = [
  { value: 'track', label: 'Track & Field' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'best-of', label: 'Best Of' },
];

export default function UploadPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('track');
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    // Filter for images only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select image files only');
      return;
    }

    // Initialize upload progress
    const newUploads: UploadProgress[] = imageFiles.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'pending',
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Upload files directly to Supabase Storage
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const uploadIndex = uploads.length + i;

      try {
        // Update status to uploading
        setUploads(prev => {
          const updated = [...prev];
          updated[uploadIndex] = { ...updated[uploadIndex], status: 'uploading', progress: 0 };
          return updated;
        });

        // Get image dimensions
        const dimensions = await getImageDimensions(file);

        // Generate unique filename
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${selectedCategory}/${timestamp}_${safeFileName}`;

        // Upload directly to Supabase Storage (no server proxy)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Update progress
        setUploads(prev => {
          const updated = [...prev];
          updated[uploadIndex] = { ...updated[uploadIndex], progress: 75 };
          return updated;
        });

        // Create database record
        const { error: dbError } = await supabase
          .from('images')
          .insert({
            storage_path: uploadData.path,
            category: selectedCategory,
            width: dimensions.width,
            height: dimensions.height,
            order: 0,
            visibility: 'draft',
          });

        if (dbError) throw dbError;

        // Mark as success
        setUploads(prev => {
          const updated = [...prev];
          updated[uploadIndex] = { ...updated[uploadIndex], status: 'success', progress: 100 };
          return updated;
        });

      } catch (error) {
        console.error('Upload error:', error);
        setUploads(prev => {
          const updated = [...prev];
          updated[uploadIndex] = { 
            ...updated[uploadIndex], 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed',
          };
          return updated;
        });
      }
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  };

  const retryUpload = (index: number) => {
    // Remove the failed upload from the list
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const cancelUpload = (index: number) => {
    // Remove from uploads list
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(u => u.status === 'uploading' || u.status === 'pending'));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-2">UPLOAD</h1>
        <p className="text-gray text-lg">Upload photos directly to Supabase Storage</p>
      </div>

      {/* Category Selection */}
      <div className="mb-8 border-4 border-near-black p-6 bg-white">
        <label className="block text-sm font-bold mb-3">SELECT CATEGORY</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`
                p-4 border-2 border-near-black font-medium transition-colors
                ${selectedCategory === cat.value 
                  ? 'bg-near-black text-white' 
                  : 'bg-white text-near-black hover:bg-off-white'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-4 border-dashed p-16 text-center cursor-pointer
          transition-colors mb-8
          ${isDragging 
            ? 'border-near-black bg-off-white' 
            : 'border-gray bg-white hover:border-near-black hover:bg-off-white'
          }
        `}
      >
        <div className="text-6xl mb-4">📤</div>
        <h3 className="text-2xl font-bold mb-2">DRAG & DROP FILES HERE</h3>
        <p className="text-gray mb-4">or click to browse</p>
        <p className="text-sm text-gray">Supports: JPG, PNG, GIF, WebP</p>
        <p className="text-sm text-gray">Upload directly to Supabase (no size limit)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="border-4 border-near-black p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">UPLOAD PROGRESS</h3>
            {uploads.some(u => u.status === 'success') && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 text-sm border-2 border-near-black hover:bg-off-white"
              >
                Clear Completed
              </button>
            )}
          </div>
          <div className="space-y-4">
            {uploads.map((upload, index) => (
              <div key={index} className="border-2 border-light-gray p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium truncate flex-1">{upload.fileName}</span>
                  <span className={`text-sm ml-4 ${
                    upload.status === 'success' ? 'text-green-600' :
                    upload.status === 'error' ? 'text-red-600' :
                    'text-gray'
                  }`}>
                    {upload.status === 'success' ? '✓ Complete' :
                     upload.status === 'error' ? '✗ Failed' :
                     upload.status === 'uploading' ? 'Uploading...' :
                     'Pending'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                {upload.status === 'uploading' && (
                  <div className="w-full bg-light-gray h-2 mb-2">
                    <div 
                      className="bg-near-black h-full transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}

                {/* Error Message */}
                {upload.status === 'error' && upload.error && (
                  <div className="text-sm text-red-600 mb-2">{upload.error}</div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {upload.status === 'error' && (
                    <button
                      onClick={() => retryUpload(index)}
                      className="text-sm px-3 py-1 border border-near-black hover:bg-off-white"
                    >
                      Retry
                    </button>
                  )}
                  {(upload.status === 'pending' || upload.status === 'error') && (
                    <button
                      onClick={() => cancelUpload(index)}
                      className="text-sm px-3 py-1 border border-gray text-gray hover:bg-off-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
