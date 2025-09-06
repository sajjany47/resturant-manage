import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Menu from "../menuModel";
import { FormatErrorMessage } from "../../UtilsAPi";

// GET: List all menu items
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const items = await Menu.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: items,
        count: items.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
