import Link from 'next/link';
import { notFound } from 'next/navigation';

const categories = {
  'track': { title: 'TRACK & FIELD', description: 'Track & field photography' },
  'soccer': { title: 'SOCCER', description: 'Soccer photography' },
  'football': { title: 'FOOTBALL', description: 'Football photography' },
  'basketball': { title: 'BASKETBALL', description: 'Basketball photography' },
  'best-of': { title: 'BEST OF', description: 'Featured collection' },
};

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  if (!Object.keys(categories).includes(category)) {
    notFound();
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
        <div className="border-4 border-near-black p-8 bg-off-white">
          <p className="text-gray text-center">
            No images yet. Upload photos from the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}
