import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "user id is required" },
        { status: 500 }
      );
    }

    const user = await users.get(userId!);
    const userPrefs = await users.getPrefs<UserPrefs>(userId!);

    if (!user.name) {
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      name: user?.name,
      reputation: userPrefs.reputation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Error deleting answer" },
      { status: error?.status || error?.code || 500 }
    );
  }
}
