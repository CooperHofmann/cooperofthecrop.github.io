# IndexedDB Storage Migration

## Overview

This document explains the migration from localStorage to IndexedDB for photo storage in the admin panel.

## Problem

The admin panel was storing all photos as base64-encoded data URLs in localStorage, which has a limited quota (typically 5-10MB). This caused quota exceeded errors when users uploaded multiple or large photos.

## Solution

Implemented a hybrid storage architecture:
- **IndexedDB**: Stores the actual photo blobs (large binary data)
- **localStorage**: Stores only metadata (IDs, filenames, timestamps, ordering)

## Benefits

1. **Larger Storage Quota**: IndexedDB typically provides 50MB+ storage (vs 5-10MB for localStorage)
2. **Efficient Storage**: Photo blobs stored in binary format instead of base64-encoded text
3. **Fast Metadata Access**: Ordering and IDs still in localStorage for quick access
4. **Backward Compatible**: Automatic migration for existing users
5. **No Breaking Changes**: All existing functionality preserved

## Technical Details

### Storage Structure

#### localStorage (before migration)
```javascript
{
  "adminPhotos": {
    "track": [
      {
        "filename": "photo1.jpg",
        "dataUrl": "data:image/jpeg;base64,/9j/4AAQ...", // Large base64 string
        "timestamp": 1600000000000
      }
    ]
  }
}
```

#### After Migration

**localStorage (metadata only)**
```javascript
{
  "adminPhotosMetadata": {
    "track": [
      {
        "id": "track_photo1.jpg_1600000000000",
        "filename": "photo1.jpg",
        "timestamp": 1600000000000
      }
    ]
  }
}
```

**IndexedDB (blobs)**
```javascript
// Object store: "photos"
{
  "id": "track_photo1.jpg_1600000000000",
  "category": "track",
  "filename": "photo1.jpg",
  "blob": Blob, // Binary image data
  "timestamp": 1600000000000
}
```

### Migration Process

1. On page load, check if old `adminPhotos` key exists in localStorage
2. If exists and contains photos with `dataUrl` property, trigger migration
3. For each photo:
   - Convert base64 dataURL to Blob
   - Generate unique ID
   - Store blob in IndexedDB
   - Create metadata entry (without dataURL)
4. Save all metadata to new `adminPhotosMetadata` key
5. Remove old `adminPhotos` key from localStorage
6. Display success notification

### Code Changes

#### Key Functions Added

- `initIndexedDB()`: Initialize IndexedDB database with schema
- `saveBlobToIndexedDB()`: Save photo blob to IndexedDB
- `getBlobFromIndexedDB()`: Retrieve photo blob from IndexedDB
- `deleteBlobFromIndexedDB()`: Delete photo blob from IndexedDB
- `dataURLToBlob()`: Convert data URL to Blob
- `blobToDataURL()`: Convert Blob to data URL for display
- `migrateToIndexedDB()`: Automatic migration function

#### Functions Updated

- `savePhoto()`: Now saves blob to IndexedDB and metadata to localStorage
- `getPhotos()`: Retrieves metadata from localStorage and blobs from IndexedDB
- `deletePhoto()`: Removes from both IndexedDB and localStorage
- `movePhoto()`: Updates metadata ordering in localStorage
- `updateStats()`: Reads from metadata instead of full photo objects
- `generateConfig()`: Uses metadata for filenames
- `downloadPhotosPackage()`: Gets blobs from IndexedDB for ZIP
- `deployDirectlyToGitHub()`: Gets blobs from IndexedDB for deployment

## Storage Comparison

### Example: 10 Photos (500KB each compressed)

**Before (localStorage only):**
- Base64 encoding: 500KB × 1.33 = 667KB per photo
- 10 photos: 6.67MB
- **Problem**: Close to or exceeding localStorage quota

**After (IndexedDB + localStorage):**
- IndexedDB blobs: 500KB × 10 = 5MB
- localStorage metadata: ~100 bytes × 10 = 1KB
- **Result**: 99.98% reduction in localStorage usage

## Testing

### Manual Testing Performed

1. ✅ New photo upload → Stored in IndexedDB
2. ✅ Photo retrieval → Loaded from IndexedDB and displayed
3. ✅ Photo deletion → Removed from both storages
4. ✅ Photo reordering → Metadata updated correctly
5. ✅ Stats counter → Updated based on metadata
6. ✅ Configuration generation → Uses metadata filenames
7. ✅ Photo download → Works with IndexedDB blobs
8. ✅ ZIP package download → Retrieves blobs from IndexedDB

### Migration Testing

- Created old-format data in localStorage
- Loaded admin panel
- Verified automatic migration
- Confirmed old key removed
- Verified photos accessible in new format

## Browser Compatibility

IndexedDB is supported in all modern browsers:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge (all versions)
- Mobile browsers (iOS Safari 10+, Chrome Android)

## Rollback Plan

If issues occur, users can:
1. Export photos using "Download Photos Package" feature
2. Clear browser storage
3. Re-upload photos

The system will create new IndexedDB storage automatically.

## Future Improvements

Possible enhancements:
1. Add compression before IndexedDB storage
2. Implement cleanup of orphaned blobs
3. Add storage usage indicator
4. Implement quota management
5. Add export/import functionality

## Monitoring

Watch for:
- Migration success rate (check console logs)
- IndexedDB errors (check browser console)
- Storage quota warnings
- Performance with large photo collections

## Support

For issues:
1. Check browser console for errors
2. Verify IndexedDB is enabled in browser
3. Check storage quota in browser settings
4. Try clearing browser storage and re-uploading photos

---

**Migration Date**: January 19, 2026  
**Author**: GitHub Copilot  
**Version**: 1.0
