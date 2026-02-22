import { z } from "astro/zod";

export const TripMetadataSchema = z
  .object({
    id: z.string(),
    country: z.string().min(2).max(3), // ISO 3166-1 alpha-2 (e.g. "PT") or alpha-3 (e.g. "PRT")
    yearsVisited: z.array(z.number()),
    photos: z.array(
      z.object({
        src: z.union([
          z
            .string()
            .url()
            .refine(
              (data) => /\.(jpg|jpeg|png|webp|gif|svg|jfif)$/i.test(data),
              {
                message: "Invalid image URL format",
              },
            ),
          z.string().refine(
            (data) => {
              const isImagePath = /\.(jpg|jpeg|png|webp|gif|svg|jfif)$/i.test(
                data,
              );
              const isLocalPath =
                /^(\/|\.\/|\.\.\/)/.test(data) || data.includes("/");
              return isImagePath && isLocalPath;
            },
            {
              message: "Invalid image path format",
            },
          ),
        ]),
        alt: z.string(),
        caption: z.string().optional(),
      }),
    ),
  })
  .strict();

export type Trip = z.infer<typeof TripMetadataSchema>;
