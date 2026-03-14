import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/admin_auth";
import { Bug, db } from "@/lib/db";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const data = await request.json() as Partial<Bug>;

    if (!session) {
        return NextResponse.json({success: false, reason: "Access denied"}, { status: 403});
    }

    if (!data || !data.id) {
        return NextResponse.json({success: false, reason: "Invalid data"}, { status: 403});
    }

    /* Update DB */
    try {
        db.deleteFrom("bugs").where("id", "=", data.id).executeTakeFirstOrThrow();
        
        return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export const revalidate = 0;
