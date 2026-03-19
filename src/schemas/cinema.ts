import { z } from "astro/zod";

export const CinemaEntryMetadataSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["movie", "series"]),
    tier: z.enum(["masterpiece", "recommended", "enjoyed"]),
    genre: z.string(),
    tags: z.array(z.string()),
    year: z.number().int().min(1900).max(2100),
    rating: z.number().min(0).max(10),
    poster: z.union([
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
    link: z.string().url().optional(),
  })
  .strict();

export type CinemaEntry = z.infer<typeof CinemaEntryMetadataSchema>;

export function cinemaEntrySchema() {
  return CinemaEntryMetadataSchema;
}
