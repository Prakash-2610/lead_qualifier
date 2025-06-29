export async function trackEvent(action: string, metadata: object = {}) {
  try {
    await fetch("http://127.0.0.1:8000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "demo-user", // You can change this
        action,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("Failed to track event:", err);
  }
}

