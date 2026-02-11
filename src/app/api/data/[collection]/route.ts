import { NextRequest, NextResponse } from 'next/server';
import { readCollection, writeCollection, addItem, updateItem, deleteItem, generateId } from '@/lib/db';

const ALLOWED = [
  'athletes', 'plans', 'appointments', 'goals', 'smartGoals',
  'weeklyCheckIns', 'achievements', 'payments', 'subscriptions',
  'athleteNotes', 'athleteDocuments', 'notifications',
];

export async function GET(req: NextRequest, { params }: { params: { collection: string } }) {
  const col = params.collection;
  if (!ALLOWED.includes(col)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }
  const athleteId = req.nextUrl.searchParams.get('athleteId');
  let data = await readCollection(col);
  if (athleteId) {
    data = data.filter((item: any) => item.athleteId === athleteId);
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: { collection: string } }) {
  const col = params.collection;
  if (!ALLOWED.includes(col)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }
  const body = await req.json();
  const item = { ...body, id: body.id || generateId() };
  const result = await addItem(col, item);
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: { params: { collection: string } }) {
  const col = params.collection;
  if (!ALLOWED.includes(col)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const result = await updateItem(col, id, updates);
  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest, { params }: { params: { collection: string } }) {
  const col = params.collection;
  if (!ALLOWED.includes(col)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const ok = await deleteItem(col, id);
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'Not found' }, { status: 404 });
}
