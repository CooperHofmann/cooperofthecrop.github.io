'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Image as ImageType, FeaturedImage } from '@/lib/supabase/types';

interface FeaturedImageWithDetails extends FeaturedImage {
  image?: ImageType;
}

export default function BestOfPage() {
  const [allImages, setAllImages] = useState<ImageType[]>([]);
  const [featuredImages, setFeaturedImages] = useState<FeaturedImageWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Load all public images
      const { data: imagesData, error: imagesError } = await supabase
        .from('images')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (imagesError) throw imagesError;
      setAllImages(imagesData || []);

      // Load featured images with their details
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_images')
        .select(`
          *,
          image:images(*)
        `)
        .order('order', { ascending: true });

      if (featuredError) throw featuredError;
      setFeaturedImages(featuredData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addToFeatured(imageId: string) {
    try {
      // Get max order
      const maxOrder = featuredImages.length > 0 
        ? Math.max(...featuredImages.map(f => f.order))
        : -1;

      const { error } = await supabase
        .from('featured_images')
        .insert({
          image_id: imageId,
          order: maxOrder + 1,
          enabled: true,
        });

      if (error) throw error;

      setShowAddModal(false);
      loadData();
    } catch (error) {
      console.error('Error adding to featured:', error);
      alert('Failed to add image to Best Of');
    }
  }

  async function removeFromFeatured(featuredId: string) {
    if (!confirm('Remove this image from Best Of?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('featured_images')
        .delete()
        .eq('id', featuredId);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error removing from featured:', error);
      alert('Failed to remove image');
    }
  }

  async function toggleEnabled(featuredId: string, currentEnabled: boolean) {
    try {
      const { error } = await supabase
        .from('featured_images')
        .update({ enabled: !currentEnabled })
        .eq('id', featuredId);

      if (error) throw error;

      // Update local state
      setFeaturedImages(featuredImages.map(f =>
        f.id === featuredId ? { ...f, enabled: !currentEnabled } : f
      ));
    } catch (error) {
      console.error('Error toggling enabled:', error);
      alert('Failed to update image');
    }
  }

  async function moveImage(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= featuredImages.length) {
      return;
    }

    // Swap orders
    const images = [...featuredImages];
    const temp = images[index];
    images[index] = images[newIndex];
    images[newIndex] = temp;

    // Update orders in state
    setFeaturedImages(images.map((img, i) => ({ ...img, order: i })));

    // Update in database
    try {
      const updates = images.map((img, i) => 
        supabase
          .from('featured_images')
          .update({ order: i })
          .eq('id', img.id)
      );

      await Promise.all(updates);
    } catch (error) {
      console.error('Error updating order:', error);
      loadData(); // Reload to fix any issues
    }
  }

  function getImageUrl(storagePath: string) {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);
    
    return data.publicUrl;
  }

  // Filter out images already in featured
  const featuredImageIds = new Set(featuredImages.map(f => f.image_id));
  const availableImages = allImages.filter(img => !featuredImageIds.has(img.id));

  return (
    <div>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-2">BEST OF</h1>
        <p className="text-gray text-lg">Curate your best photos with drag-and-drop ordering</p>
      </div>

      {/* Add Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-near-black text-white font-bold border-4 border-near-black hover:bg-white hover:text-near-black transition-colors"
        >
          + ADD IMAGE TO BEST OF
        </button>
      </div>

      {/* Featured Images List */}
      <div className="border-4 border-near-black p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">FEATURED IMAGES</h3>
          <span className="text-gray">
            {featuredImages.length} {featuredImages.length === 1 ? 'image' : 'images'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray">Loading...</div>
        ) : featuredImages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-light-gray">
            <p className="text-gray mb-4">No images in Best Of yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-block px-6 py-3 border-2 border-near-black bg-white hover:bg-off-white"
            >
              Add Your First Image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {featuredImages.map((featured, index) => (
              <div 
                key={featured.id}
                className="flex items-center gap-4 p-4 border-2 border-near-black bg-off-white"
              >
                {/* Order Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 border border-near-black bg-white hover:bg-light-gray disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === featuredImages.length - 1}
                    className="px-2 py-1 border border-near-black bg-white hover:bg-light-gray disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ▼
                  </button>
                </div>

                {/* Order Number */}
                <div className="w-12 text-center font-bold text-2xl">
                  {index + 1}
                </div>

                {/* Image Thumbnail */}
                {featured.image && (
                  <div className="w-24 h-24 border-2 border-near-black bg-light-gray">
                    <img
                      src={getImageUrl(featured.image.storage_path)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Image Info */}
                <div className="flex-1">
                  {featured.image && (
                    <>
                      <p className="font-medium">{featured.image.category}</p>
                      <p className="text-sm text-gray">
                        {featured.image.width} × {featured.image.height}
                      </p>
                    </>
                  )}
                </div>

                {/* Status */}
                <div>
                  <span className={`
                    px-3 py-1 border-2 border-near-black text-sm font-medium
                    ${featured.enabled ? 'bg-green-100' : 'bg-gray-100'}
                  `}>
                    {featured.enabled ? '✓ Enabled' : '✗ Disabled'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleEnabled(featured.id, featured.enabled)}
                    className="px-4 py-2 border-2 border-near-black bg-white hover:bg-off-white text-sm font-medium"
                  >
                    {featured.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => removeFromFeatured(featured.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium border-2 border-red-600 hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-near-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-near-black max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b-4 border-near-black flex justify-between items-center">
              <h2 className="text-3xl font-bold">ADD IMAGE TO BEST OF</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-4xl hover:text-gray"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {availableImages.length === 0 ? (
                <p className="text-center text-gray py-12">
                  No available public images. Upload more images or make existing images public.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableImages.map(image => (
                    <button
                      key={image.id}
                      onClick={() => addToFeatured(image.id)}
                      className="border-2 border-near-black hover:border-4 transition-all bg-off-white group"
                    >
                      <div className="aspect-square bg-light-gray">
                        <img
                          src={getImageUrl(image.storage_path)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 text-xs">
                        <p className="font-medium">{image.category}</p>
                        <p className="text-gray">{image.width} × {image.height}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
