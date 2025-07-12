// src/features/courses/db/cache/courses.ts

import { getGlobalTab, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getCourseGlobalTag() {
  return getGlobalTab("courses")
}

export function getCourseIdTag(id: string){
  return getIdTag("courses", id);
}

export function revalidateCourseCache(id: string){
  revalidateTag(getCourseGlobalTag())
  revalidateTag(getCourseIdTag(id))
}