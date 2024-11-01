// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { zodBuffer } from "@app/lib/zod";

import { TImmutableDBKeys } from "./models";

export const UserSecretsSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  type: z.string(),
  value: z.string().nullable().optional(),
  encryptedValue: zodBuffer.nullable().optional(),
  userId: z.string().uuid().nullable().optional(),
  orgId: z.string().uuid().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TUserSecrets = z.infer<typeof UserSecretsSchema>;
export type TUserSecretsInsert = Omit<z.input<typeof UserSecretsSchema>, TImmutableDBKeys>;
export type TUserSecretsUpdate = Partial<Omit<z.input<typeof UserSecretsSchema>, TImmutableDBKeys>>;
