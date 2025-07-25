// src/features/courseSections/actions/sections.ts
"use server";

import z from "zod";
import { getCurrentUser } from "@/services/clerk";
import { sectionSchema } from "../schemas/sections";
import { canCreateCourseSections, canDeleteCourseSections, canUpdateCourseSections } from "../permissions/sections";
import { getNextCourseSectionOrder, insertSection, updateSection as updateSectionDB, deleteSection as deleteSectionDB, updateSectionOrders as updateSectionOrdersDB } from "../db/sections";

export async function createSection(courseId: string, unsafeData: z.infer<typeof sectionSchema>) {
  const { success, data } = sectionSchema.safeParse(unsafeData)
  if (!success || !canCreateCourseSections(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your section" }
  }
  const order = await getNextCourseSectionOrder(courseId)
  await insertSection({ ...data, courseId, order })
  return { error: false, message: "Successfully created your section" }
}

export async function updateSection(id: string, unsafeData: z.infer<typeof sectionSchema>) {
  const { success, data } = sectionSchema.safeParse(unsafeData)
  if (!success || !canUpdateCourseSections(await getCurrentUser())) {
    return { error: true, message: "There was an error updating your section" }
  }
  await updateSectionDB(id, data)
  return { error: false, message: "Successfully updated your section" }
}

export async function deleteSection(id: string) {
  if (!canDeleteCourseSections(await getCurrentUser())) {
    return { error: true, message: "Error deleting your section" }
  }
  await deleteSectionDB(id)
  return { error: false, message: "Successfully deleted your section" }
}

export async function updateSectionOrders(sectionIds: string[]) {
  if (sectionIds.length === 0 || !canUpdateCourseSections(await getCurrentUser())) {
    return { error: true, message: "Error reordering your sections" }
  }
  await updateSectionOrdersDB(sectionIds)
  return { error: false, message: "Successfully reordered your sections" }
}