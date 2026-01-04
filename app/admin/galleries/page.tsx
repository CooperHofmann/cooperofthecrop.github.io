'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Image as ImageType, Category } from '@/lib/supabase/types';

const categories: { value: Category; label: string; emoji: string }[] = [
  { value: 'track', label: 'Track & Field', emoji: '🏃' },
  { value: 'soccer', label: 'Soccer', emoji: '⚽' },
  { value: 'football', label: 'Football', emoji: '🏈' },
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'best-of', label: 'Best Of', emoji: '⭐' },
];

export default function GalleriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('track');
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  async function loadImages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('category', selectedCategory)
        .order('order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(imageId: string, storagePath: string) {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      // Refresh list
      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  }

  async function toggleVisibility(imageId: string, currentVisibility: string) {
    const newVisibility = currentVisibility === 'public' ? 'draft' : 'public';

    try {
      const { error } = await supabase
        .from('images')
        .update({ visibility: newVisibility })
        .eq('id', imageId);

      if (error) throw error;

      // Update local state
      setImages(images.map(img => 
        img.id === imageId ? { ...img, visibility: newVisibility as any } : img
      ));
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Failed to update visibility');
    }
  }

  function getImageUrl(storagePath: string) {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);
    
    return data.publicUrl;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-2">GALLERIES</h1>
        <p className="text-gray text-lg">Manage photos by category</p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 border-4 border-near-black p-6 bg-white">
        <label className="block text-sm font-bold mb-3">SELECT CATEGORY</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`
                p-4 border-2 border-near-black font-medium transition-colors
                flex items-center justify-center gap-2
                ${selectedCategory === cat.value 
                  ? 'bg-near-black text-white' 
                  : 'bg-white text-near-black hover:bg-off-white'
                }
              `}
            >
              <span>{cat.emoji}</span>
              <span className="hidden md:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      <div className="border-4 border-near-black p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">
            {categories.find(c => c.value === selectedCategory)?.label || 'Images'}
          </h3>
          <span className="text-gray">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-light-gray">
            <p className="text-gray mb-4">No images in this category yet</p>
            <a
              href="/admin/upload"
              className="inline-block px-6 py-3 border-2 border-near-black bg-white hover:bg-off-white"
            >
              Upload Images
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div 
                key={image.id}
                className="border-2 border-near-black bg-off-white group"
              >
                {/* Image */}
                <div className="aspect-square bg-light-gray relative overflow-hidden">
                  <img
                    src={getImageUrl(image.storage_path)}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-near-black bg-opacity-0 group-hover:bg-opacity-80 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => toggleVisibility(image.id, image.visibility)}
                      className="px-3 py-2 bg-white text-near-black text-sm font-medium border-2 border-white hover:bg-off-white"
                      title={image.visibility === 'public' ? 'Make Draft' : 'Make Public'}
                    >
                      {image.visibility === 'public' ? '👁️ Public' : '📝 Draft'}
                    </button>
                    <button
                      onClick={() => deleteImage(image.id, image.storage_path)}
                      className="px-3 py-2 bg-red-600 text-white text-sm font-medium border-2 border-red-600 hover:bg-red-700"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-3">
                  <div className="flex justify-between items-center text-xs text-gray">
                    <span>{image.width} × {image.height}</span>
                    <span className={`
                      px-2 py-1 border border-near-black text-xs font-medium
                      ${image.visibility === 'public' ? 'bg-green-100' : 'bg-gray-100'}
                    `}>
                      {image.visibility === 'public' ? 'Public' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
