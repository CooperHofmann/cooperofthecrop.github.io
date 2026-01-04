'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Image as ImageType } from '@/lib/supabase/types';

const categories = {
  'track': { title: 'TRACK & FIELD', description: 'Track & field photography' },
  'soccer': { title: 'SOCCER', description: 'Soccer photography' },
  'football': { title: 'FOOTBALL', description: 'Football photography' },
  'basketball': { title: 'BASKETBALL', description: 'Basketball photography' },
  'best-of': { title: 'BEST OF', description: 'Featured collection' },
};

export default function GalleryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  useEffect(() => {
    params.then(p => {
      if (!Object.keys(categories).includes(p.category)) {
        notFound();
      }
      setCategory(p.category);
      loadImages(p.category);
    });
  }, [params]);

  async function loadImages(cat: string) {
    try {
      setLoading(true);

      if (cat === 'best-of') {
        // For Best Of, load featured images
        const { data, error } = await supabase
          .from('featured_images')
          .select(`
            *,
            image:images(*)
          `)
          .eq('enabled', true)
          .order('order', { ascending: true });

        if (error) throw error;

        // Extract images from featured_images
        const imageData = data
          ?.map((f: any) => f.image)
          .filter((img: any) => img && img.visibility === 'public') || [];

        setImages(imageData);
      } else {
        // For regular categories, load public images
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .eq('category', cat)
          .eq('visibility', 'public')
          .order('order', { ascending: true });

        if (error) throw error;
        setImages(data || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(storagePath: string) {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);
    
    return data.publicUrl;
  }

  if (!category) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray">Loading...</p>
    </div>;
  }

  const categoryInfo = categories[category as keyof typeof categories];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-16 max-w-6xl">
        {/* Header */}
        <div className="border-b-4 border-near-black pb-8 mb-16">
          <Link href="/" className="text-gray hover:text-near-black mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
            {categoryInfo.title}
          </h1>
          <p className="text-xl text-gray">{categoryInfo.description}</p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="border-4 border-near-black p-8 bg-off-white">
            <p className="text-gray text-center">
              No images yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* First image - featured (full width) */}
            {images[0] && (
              <button
                onClick={() => setSelectedImage(images[0])}
                className="w-full mb-8 border-4 border-near-black overflow-hidden hover:border-8 transition-all"
              >
                <img
                  src={getImageUrl(images[0].storage_path)}
                  alt=""
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '70vh' }}
                  loading="eager"
                />
              </button>
            )}

            {/* Rest of images - grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.slice(1).map(image => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className="border-4 border-near-black overflow-hidden hover:border-8 transition-all aspect-square"
                  >
                    <img
                      src={getImageUrl(image.storage_path)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-near-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={getImageUrl(selectedImage.storage_path)}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
