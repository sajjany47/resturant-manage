import { getHeaders } from "@/lib/utils";
import axios from "axios";

export const MenuCreate = async (payload: any) => {
  try {
    const response = await axios.post("/api/menu/create", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const MenuUpdate = async (payload: any) => {
  try {
    const response = await axios.post("/api/menu/update", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const MenuList = async () => {
  try {
    const response = await axios.get("/api/menu/list", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const DeleteMenuItem = async (id: string) => {
  try {
    const response = await axios.delete(`/api/menu/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete menu item"
    );
  }
};
