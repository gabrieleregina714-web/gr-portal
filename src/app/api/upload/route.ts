import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'documents';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedFolders = ['documents', 'avatars', 'covers'];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'bin';
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const blob = await put(safeName, file, {
      access: 'public',
    });

    const bytes = await file.arrayBuffer();
    const size = bytes.byteLength < 1024 * 1024
      ? `${Math.round(bytes.byteLength / 1024)} KB`
      : `${(bytes.byteLength / (1024 * 1024)).toFixed(1)} MB`;

    return NextResponse.json({ url: blob.url, name: file.name, size });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
