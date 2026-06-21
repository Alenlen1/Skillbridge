import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Called right after a user changes something that affects their public
// portfolio page (visibility, content edits) so the cached version is
// thrown away immediately instead of waiting for the revalidate timer.
export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 },
      );
    }

    revalidatePath(`/${username}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Revalidate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to revalidate" },
      { status: 500 },
    );
  }
}
