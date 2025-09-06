import mongoose, { Schema } from "mongoose";

const ExpenseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Expense name is required"],
    trim: true,
  },
  cost: {
    type: Number,
    required: [true, "Cost is required"],
    min: [0, "Cost must be positive"],
  },
});

const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    expenses: {
      type: [ExpenseSchema],
      validate: [
        {
          validator: (arr: any) => arr.length > 0,
          message: "At least one expense item is required",
        },
      ],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost must be positive"],
    },
    desiredProfit: {
      type: Number,
      required: [true, "Desired profit is required"],
      min: [0, "Profit must be positive"],
    },
    zomatoPrice: {
      type: Number,
      required: [true, "Zomato price is required"],
      min: [0, "Price must be positive"],
    },
    swiggyPrice: {
      type: Number,
      required: [true, "Swiggy price is required"],
      min: [0, "Price must be positive"],
    },
    offlinePrice: {
      type: Number,
      required: [true, "Offline price is required"],
      min: [0, "Price must be positive"],
    },
    onlinePrice: {
      type: Number,
      required: [true, "Online price is required"],
      min: [0, "Price must be positive"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock must be positive"],
    },
    minStock: {
      type: Number,
      required: [true, "Min stock is required"],
      min: [0, "Min stock must be positive"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Menu = mongoose.models?.Menu || mongoose.model("Menu", ItemSchema);

export default Menu;
