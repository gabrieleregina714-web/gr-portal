// Client-side API helper for data persistence
const BASE = '/api/data';

export async function fetchCollection<T>(collection: string, params?: Record<string, string>): Promise<T[]> {
  const url = new URL(`${BASE}/${collection}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch ${collection}`);
  return res.json();
}

export async function createItem<T>(collection: string, data: Partial<T>): Promise<T> {
  const res = await fetch(`${BASE}/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create in ${collection}`);
  return res.json();
}

export async function updateItemApi<T>(collection: string, id: string, updates: Partial<T>): Promise<T> {
  const res = await fetch(`${BASE}/${collection}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error(`Failed to update in ${collection}`);
  return res.json();
}

export async function deleteItemApi(collection: string, id: string): Promise<void> {
  const res = await fetch(`${BASE}/${collection}?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete from ${collection}`);
}

export async function uploadFile(file: File, folder: 'documents' | 'avatars' | 'covers'): Promise<{ url: string; name: string; size: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
