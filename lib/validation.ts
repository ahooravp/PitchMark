import { z } from "zod";

// A reusable validator that only checks size and type, but doesn't force a requirement.
// It bypasses the checks if the file is empty (size === 0).
export const baseImageValidator = z.any()
  .refine((file) => !file || file.size === 0 || file.type.startsWith("image/"), 
    "Only image files (JPG, PNG, WebP) are allowed.")
  .refine((file) => !file || file.size === 0 || file.size <= 5 * 1024 * 1024, 
    "Image must be smaller than 5MB.");


// The Startup Form (Requires an image)
export const startupSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.string().min(3).max(20),
  pitch: z.string().min(10),
  
  // We apply the base validator, then strictly require the file to exist
  file: baseImageValidator
    .refine((file) => file && file.size > 0, "A startup image is strictly required."),
});

// The Profile Settings Form (Image is optional)
export const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),
  bio: z.string()
    .max(500, "Bio cannot exceed 500 characters.")
    .optional(),
  
  // We use the base validator, but don't force a size > 0 check
  avatar: baseImageValidator, 
});