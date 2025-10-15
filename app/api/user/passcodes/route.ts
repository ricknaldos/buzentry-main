import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/user-db';
import { Passcode } from '@/lib/types';

// Get all passcodes
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ passcodes: profile.passcodes || [] });
  } catch (error) {
    console.error('Error fetching passcodes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create a new passcode
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { label, expiresInHours, maxUsages } = body;

    if (!label || label.trim().length === 0) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }

    // Generate a random 4-6 digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    const now = Date.now();
    const newPasscode: Passcode = {
      id: `passcode_${now}_${Math.random().toString(36).substring(7)}`,
      code,
      label: label.trim(),
      createdAt: now,
      expiresAt: expiresInHours ? now + (expiresInHours * 60 * 60 * 1000) : null,
      usageCount: 0,
      maxUsages: maxUsages || null,
      lastUsedAt: null,
      isActive: true,
    };

    const existingPasscodes = profile.passcodes || [];
    const updatedProfile = await updateUserProfile(profile.userId, {
      passcodes: [...existingPasscodes, newPasscode],
    });

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Failed to create passcode' }, { status: 500 });
    }

    return NextResponse.json({ passcode: newPasscode });
  } catch (error) {
    console.error('Error creating passcode:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete a passcode
export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const passcodeId = searchParams.get('id');

    if (!passcodeId) {
      return NextResponse.json({ error: 'Passcode ID is required' }, { status: 400 });
    }

    const existingPasscodes = profile.passcodes || [];
    const updatedPasscodes = existingPasscodes.filter(p => p.id !== passcodeId);

    if (updatedPasscodes.length === existingPasscodes.length) {
      return NextResponse.json({ error: 'Passcode not found' }, { status: 404 });
    }

    const updatedProfile = await updateUserProfile(profile.userId, {
      passcodes: updatedPasscodes,
    });

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Failed to delete passcode' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting passcode:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Toggle passcode active status
export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await getUserByEmail(session.user.email);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { passcodeId, isActive } = body;

    if (!passcodeId) {
      return NextResponse.json({ error: 'Passcode ID is required' }, { status: 400 });
    }

    const existingPasscodes = profile.passcodes || [];
    const updatedPasscodes = existingPasscodes.map(p =>
      p.id === passcodeId ? { ...p, isActive: isActive !== undefined ? isActive : !p.isActive } : p
    );

    const updatedProfile = await updateUserProfile(profile.userId, {
      passcodes: updatedPasscodes,
    });

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Failed to update passcode' }, { status: 500 });
    }

    return NextResponse.json({ success: true, passcodes: updatedPasscodes });
  } catch (error) {
    console.error('Error updating passcode:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
