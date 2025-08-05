import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    url: z.url("Invalid URL format").optional(),
    imagePath: z.string().min(1, "Image path is required"),
    role: z.string().min(1, "Role is required"),
    startAt: z.string().min(1, "Start date is required"),
    endAt: z.string().min(1, "End date is required").optional(),
});
export type Project = z.infer<typeof projectSchema>;