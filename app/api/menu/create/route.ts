export const dynamic = "force-dynamic";

import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Menu from "../menuModel";
import { FormatErrorMessage } from "../../UtilsAPi";

// POST: Create a new menu item
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const data = await req.json();
    console.log(data);
    // Check for duplicate by name + category (you can adjust logic as needed)
    const existing = await Menu.findOne({
      name: data.name,
      category: data.category,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Menu item with this name already exists in the same category",
        },
        { status: 409 }
      );
    }

    // Add isAvailable default = true
    const menuData = {
      ...data,
      isAvailable: true,
    };

    const newMenu = await Menu.create(menuData);

    return NextResponse.json(
      {
        success: true,
        menu: newMenu,
        message: "Menu item created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: FormatErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
