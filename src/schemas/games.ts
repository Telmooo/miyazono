import { z } from "astro/zod";

export const GameSectionMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

export type GameSection = z.infer<typeof GameSectionMetadataSchema>;

export function gameSectionSchema() {
  return GameSectionMetadataSchema;
}

export const GameMetadataSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    section: z.string(),
    genres: z.array(z.string()),
    platforms: z.array(z.string()),
    cover: z.union([
      z
        .string()
        .url()
        .refine((data) => /\.(jpg|jpeg|png|webp|gif|svg|jfif)$/i.test(data), {
          message: "Invalid image URL format",
        }),
      z.string().refine(
        (data) => {
          const isImagePath = /\.(jpg|jpeg|png|webp|gif|svg|jfif)$/i.test(data);
          const isLocalPath =
            /^(\/|\.\/|\.\.\/)/.test(data) || data.includes("/");
          return isImagePath && isLocalPath;
        },
        {
          message: "Invalid image path format",
        },
      ),
    ]),
    storePage: z.string().url().optional(),
    stats: z
      .object({
        hoursPlayed: z.number().nonnegative().optional(),
        completionPercent: z.number().min(0).max(100).optional(),
        achievements: z
          .object({
            total: z.number().nonnegative(),
            unlocked: z.number().nonnegative(),
          })
          .refine((data) => data.unlocked <= data.total, {
            message: "Unlocked achievements cannot exceed total achievements",
            path: ["unlocked"],
          })
          .optional(),
        rating: z.number().min(0).max(10).optional(),
      })
      .optional(),
  })
  .strict();

export type Game = z.infer<typeof GameMetadataSchema>;

export function gameSchema() {
  return GameMetadataSchema;
}
