import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Menu from "../menuModel";
import { FormatErrorMessage } from "../../UtilsAPi";

// DELETE: Remove a menu item by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;
    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Menu item deleted successfully",
        data: deletedItem,
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
