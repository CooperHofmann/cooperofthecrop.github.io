import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-16 max-w-6xl">
        {/* Header */}
        <header className="border-b-4 border-near-black pb-8 mb-16">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
            COOPER OF<br />THE CROP
          </h1>
          <p className="text-xl text-gray">
            Sports Photography Portfolio
          </p>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <CategoryCard 
            title="TRACK & FIELD"
            href="/gallery/track"
            description="Track & field photography"
          />
          <CategoryCard 
            title="SOCCER"
            href="/gallery/soccer"
            description="Soccer photography"
          />
          <CategoryCard 
            title="FOOTBALL"
            href="/gallery/football"
            description="Football photography"
          />
          <CategoryCard 
            title="BASKETBALL"
            href="/gallery/basketball"
            description="Basketball photography"
          />
        </div>

        {/* Best Of Section */}
        <div className="border-4 border-near-black p-8 mb-8">
          <h2 className="text-4xl font-bold mb-4">BEST OF</h2>
          <p className="text-gray mb-6">Featured collection of top shots from all categories</p>
          <Link 
            href="/gallery/best-of"
            className="inline-block px-8 py-4 bg-near-black text-white font-bold border-4 border-near-black hover:bg-white hover:text-near-black transition-colors"
          >
            VIEW COLLECTION
          </Link>
        </div>

        {/* Admin Access */}
        <div className="text-center pt-8 border-t-2 border-light-gray">
          <Link 
            href="/admin"
            className="text-gray hover:text-near-black transition-colors"
          >
            Admin Access
          </Link>
        </div>
      </main>
    </div>
  );
}

function CategoryCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link 
      href={href}
      className="block border-4 border-near-black p-8 hover:bg-off-white transition-colors"
    >
      <h3 className="text-3xl font-bold mb-2">{title}</h3>
      <p className="text-gray">{description}</p>
    </Link>
  );
}
