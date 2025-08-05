import { z } from "zod";

export const skillSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
    icon: z.string().min(1, "Skill icon is required"),
});
export type Skill = z.infer<typeof skillSchema>;