import { NextResponse } from 'next/server';
import { setupProductionDatabase } from '@/scripts/setup-production-db';

export async function GET(request: Request) {
  try {
    // Simple security check
    const authHeader = request.headers.get('authorization');
    const setupSecret = process.env.SETUP_SECRET || process.env.CRON_SECRET;
    
    if (setupSecret && authHeader !== `Bearer ${setupSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 Starting production database setup...');
    await setupProductionDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Production database setup completed successfully'
    });

  } catch (error) {
    console.error('Database setup failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
