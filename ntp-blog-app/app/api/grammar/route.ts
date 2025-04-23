import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
 
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { data } = await axios.post(
          `${process.env.NODE_RED_URL}/blogCorrection`,
          {
            ...body,
          },
        );
       
        return NextResponse.json({data})
       
      }
     catch (error) {
      if (axios.isAxiosError(error)) {
        return NextResponse.json(
          {
            message: "Failed to fix errors with AI",
            error: error.message,
          },
          { status: error.response?.status || 500 },
        );
      }
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
 
