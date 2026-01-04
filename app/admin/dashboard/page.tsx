'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Stats {
  track: number;
  soccer: number;
  football: number;
  basketball: number;
  bestOf: number;
  total: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    track: 0,
    soccer: 0,
    football: 0,
    basketball: 0,
    bestOf: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      // Fetch image counts by category
      const { data, error } = await supabase
        .from('images')
        .select('category');

      if (error) throw error;

      if (data) {
        const counts = data.reduce((acc: Record<string, number>, img: any) => {
          acc[img.category] = (acc[img.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setStats({
          track: counts.track || 0,
          soccer: counts.soccer || 0,
          football: counts.football || 0,
          basketball: counts.basketball || 0,
          bestOf: counts['best-of'] || 0,
          total: data.length,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-2">DASHBOARD</h1>
        <p className="text-gray text-lg">Portfolio overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Images"
          value={loading ? '...' : stats.total}
          icon="📸"
          large
        />
        <StatCard
          title="Track & Field"
          value={loading ? '...' : stats.track}
          icon="🏃"
        />
        <StatCard
          title="Soccer"
          value={loading ? '...' : stats.soccer}
          icon="⚽"
        />
        <StatCard
          title="Football"
          value={loading ? '...' : stats.football}
          icon="🏈"
        />
        <StatCard
          title="Basketball"
          value={loading ? '...' : stats.basketball}
          icon="🏀"
        />
        <StatCard
          title="Best Of"
          value={loading ? '...' : stats.bestOf}
          icon="⭐"
        />
      </div>

      {/* Quick Actions */}
      <div className="border-4 border-near-black p-8 bg-white">
        <h2 className="text-3xl font-bold mb-6">QUICK ACTIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionButton href="/admin/upload" icon="⬆️" label="Upload Photos" />
          <ActionButton href="/admin/galleries" icon="🖼️" label="Manage Galleries" />
          <ActionButton href="/admin/best-of" icon="⭐" label="Curate Best Of" />
          <ActionButton href="/admin/settings" icon="⚙️" label="Settings" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  large = false 
}: { 
  title: string; 
  value: string | number; 
  icon: string;
  large?: boolean;
}) {
  return (
    <div className={`border-4 border-near-black p-6 bg-white ${large ? 'md:col-span-3' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray text-sm mb-1">{title}</p>
          <p className={`font-bold ${large ? 'text-5xl' : 'text-3xl'}`}>{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

function ActionButton({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 border-2 border-near-black bg-white hover:bg-off-white transition-colors"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
}
