// src/content/config.ts
import { defineCollection, z } from 'astro:content';

export const collections = {
  docs: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  }),
};
