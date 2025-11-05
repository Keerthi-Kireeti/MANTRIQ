import { NextRequest, NextResponse } from "next/server";

// In-memory storage for demo purposes
// In production, this would be stored in a database (MongoDB/Firebase)
const sessionsStore: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Simulate database query delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return paginated sessions
    const paginatedSessions = sessionsStore
      .slice(offset, offset + limit)
      .reverse(); // Most recent first

    return NextResponse.json({
      sessions: paginatedSessions,
      total: sessionsStore.length,
      limit,
      offset,
    });

  } catch (error) {
    console.error("Sessions GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();

    // Validate session data
    if (!sessionData.messages || !Array.isArray(sessionData.messages)) {
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }

    // Create session entry
    const session = {
      id: Date.now().toString(),
      messages: sessionData.messages,
      timestamp: sessionData.timestamp || new Date().toISOString(),
      messageCount: sessionData.messages.length,
      lastMode: sessionData.messages[sessionData.messages.length - 1]?.mode || "unknown",
    };

    // Store session
    sessionsStore.push(session);

    console.log("Session saved:", session.id);

    // Simulate database write delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        message: "Session saved successfully",
        sessionId: session.id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Sessions POST Error:", error);
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Find and remove session
    const index = sessionsStore.findIndex((s) => s.id === sessionId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    sessionsStore.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    });

  } catch (error) {
    console.error("Sessions DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
