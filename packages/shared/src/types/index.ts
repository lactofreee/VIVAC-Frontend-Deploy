import { z } from "zod";

export const SpotSortSchema = z.enum(["popular", "latest", "rating"]);
export type SpotSort = z.infer<typeof SpotSortSchema>;

export const spotListItemSchema = z.object({
  uid: z.string().uuid(),
  title: z.string(),
  tagline: z.string().nullable(),
  region_province: z.string().nullable(),
  region_city: z.string().nullable(),
  rating_avg: z.number(),
  review_count: z.number().int(),
  themes: z.array(z.string()).nullable(),
});
export type SpotListItem = z.infer<typeof spotListItemSchema>;

export const spotDetailSchema = z.object({
  uid: z.string().uuid(),
  title: z.string(),
  tagline: z.string().nullable(),
  description: z.string().nullable(),
  address: z.string().nullable(),
  address_detail: z.string().nullable(),
  region_province: z.string().nullable(),
  region_city: z.string().nullable(),
  postal_code: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  altitude: z.number().nullable(),
  phone: z.string().nullable(),
  website_url: z.string().nullable(),
  booking_url: z.string().nullable(),
  unit_count: z.number().int().nullable(),
  total_area_m2: z.number().nullable(),
  is_fee_required: z.boolean().nullable(),
  is_pet_allowed: z.boolean().nullable(),
  pet_policy: z.string().nullable(),
  has_liability_insurance: z.boolean().nullable(),
  themes: z.array(z.string()).nullable(),
  category: z.array(z.string()).nullable(),
  camp_sight_type: z.string().nullable(),
  fire_pit_type: z.string().nullable(),
  features: z.string().nullable(),
  amenities: z.array(z.string()).nullable(),
  nearby_facilities: z.array(z.string()).nullable(),
  has_equipment_rental: z.array(z.string()).nullable(),
  rating_avg: z.number(),
  review_count: z.number().int(),
  created_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime().nullable(),
});
export type SpotDetail = z.infer<typeof spotDetailSchema>;

export const spotListResponseSchema = z.object({
  items: z.array(spotListItemSchema),
  next_cursor: z.string().nullable(),
  has_more: z.boolean(),
  total: z.number().int().nullable().optional(),
});
export type SpotListResponse = z.infer<typeof spotListResponseSchema>;

export const spotFilterSchema = z.object({
  q: z.string().optional(),
  sort: SpotSortSchema.optional(),
});
export type SpotFilter = z.infer<typeof spotFilterSchema>;
