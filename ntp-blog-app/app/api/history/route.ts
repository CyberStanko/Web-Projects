import { getAllItems } from "@/app/lib/dynamodb";

export async function GET() {
  try {
    const items = await getAllItems("Ntp-blog-app-Testing");
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return new Response(JSON.stringify({ error: "Error fetching items" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}