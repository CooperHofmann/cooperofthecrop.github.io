// Database types for type-safe queries

export type Category = 'track' | 'soccer' | 'football' | 'basketball' | 'best-of';
export type Visibility = 'public' | 'draft';

export interface Image {
  id: string;
  storage_path: string;
  category: Category;
  width: number;
  height: number;
  order: number;
  visibility: Visibility;
  created_at: string;
  updated_at?: string;
}

export interface FeaturedImage {
  id: string;
  image_id: string;
  order: number;
  enabled: boolean;
  created_at: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
