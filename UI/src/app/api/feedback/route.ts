import { NextRequest, NextResponse } from "next/server";

// In-memory storage for demo purposes
// In production, this would be stored in a database
const feedbackStore: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const feedback = await request.json();

    // Validate required fields
    if (!feedback.name || !feedback.email || !feedback.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedback.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Add timestamp and ID
    const feedbackEntry = {
      id: Date.now().toString(),
      ...feedback,
      timestamp: new Date().toISOString(),
      status: "new",
    };

    // Store feedback
    feedbackStore.push(feedbackEntry);

    console.log("New feedback received:", feedbackEntry);

    // Simulate database write delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      { 
        success: true,
        message: "Feedback submitted successfully",
        id: feedbackEntry.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all feedback (in production, add pagination and auth)
  return NextResponse.json({
    feedback: feedbackStore,
    count: feedbackStore.length
  });
}
