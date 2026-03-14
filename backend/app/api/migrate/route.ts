import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin_auth";

import { migrateFromPSToTurso } from "@/lib/migrations/turso";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({success: false, reason: "Access denied"}, { status: 403 });
    }

    // migrateFromPSToTurso();

    return NextResponse.json({ success: true }, { status: 200 });
}

export const revalidate = 0;
