import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Menu from "../menuModel";
import { FormatErrorMessage } from "../../UtilsAPi";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const data = await req.json();

    // Ensure itemId is provided
    if (!data.menuId) {
      return NextResponse.json(
        { success: false, message: "menuId is required" },
        { status: 400 }
      );
    }

    // Update menu item
    const updateMenu = await Menu.findByIdAndUpdate(data.menuId, data, {
      new: true,
      runValidators: true,
    });

    if (!updateMenu) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        menu: updateMenu,
        message: "Menu item updated successfully",
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
