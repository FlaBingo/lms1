// src/features/users/db/users.ts
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./cache";

export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [newUser] = await db.insert(UserTable).values(data).returning().onConflictDoUpdate({
    target: [UserTable.clerkUserId],
    set: data,
  }) // brother(Kyle) said this could be undefined, It'd still work because null == undefined is true 
  //and null === undefined is false

  if (newUser == null) throw new Error("Failed to create user")
  revalidateUserCache(newUser.id)
  return newUser;
}

export async function updateUser({ clerkUserId }: { clerkUserId: string }, data: Partial<typeof UserTable.$inferInsert>) {
  const [updatedUser] = await db.update(UserTable).set(data).where(eq(UserTable.clerkUserId, clerkUserId)).returning()

  if (updatedUser == null) throw new Error("Failed to update user")
  revalidateUserCache(updatedUser.id)
  return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
  const [deletedUser] = await db.update(UserTable).set({
    deletedAt: new Date(),
    email: "redacted@deleted.com",
    name: "Deleted User",
    clerkUserId: "deleted",
    imageUrl: null,
  }).where(eq(UserTable.clerkUserId, clerkUserId)).returning()

  if (deletedUser == null) throw new Error("Failed to delete user")
  revalidateUserCache(deletedUser.id)
  return deletedUser;
}