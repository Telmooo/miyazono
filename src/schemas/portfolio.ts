import { z } from "astro/zod";

export const SkillMetadataSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.enum([
      "programming-languages",
      "machine-learning",
      "backend",
      "frontend",
      "devops",
      "tools",
      "languages",
    ]),
    proficiency: z.number().min(1).max(5),
    learning: z.boolean().default(false),
  })
  .strict();

export type Skill = z.infer<typeof SkillMetadataSchema>;

export function skillSchema() {
  return SkillMetadataSchema;
}

export const ProjectMetadataSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    categories: z.array(
      z.enum([
        "backend",
        "machine-learning",
        "computer-vision",
        "nlp",
        "AR",
        "web",
        "devops",
        "tools",
        "other",
      ]),
    ),
    links: z
      .object({
        github: z.string().url().optional(),
        live: z.string().url().optional(),
      })
      .optional(),
    featured: z.boolean().optional(),
  })
  .strict();

export type Project = z.infer<typeof ProjectMetadataSchema>;

export function projectSchema() {
  return ProjectMetadataSchema;
}
