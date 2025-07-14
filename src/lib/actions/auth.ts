'use server';

import { serverUsers } from "@/lib/appwrite/server";

export async function deleteUserIfNotAdmin(userId: string) {
  try {
    const user = await serverUsers.get(userId);
    if (!user.labels.includes('admin')) {
      await serverUsers.delete(userId);
      return { success: true };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}