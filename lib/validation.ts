import { z } from "zod";

// A reusable validator that only checks size and type, but doesn't force a requirement.
export const baseImageValidator = z.any()
  .refine((file) => !file || file.size === 0 || file.type.startsWith("image/"), 
    "Only image files (JPG, PNG, WebP) are allowed.")
  .refine((file) => !file || file.size === 0 || file.size <= 5 * 1024 * 1024, 
    "Image must be smaller than 5MB.");

// The Startup Form
export const startupSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "A title is required." }) // Catches empty strings/spaces
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Your title cannot exceed 100 characters." }),
    
  description: z.string()
    .trim()
    .min(1, { message: "A description is required." })
    .min(10, { message: "Please provide a description of at least 10 characters." })
    .max(500, { message: "Description is too long. Keep it under 500 characters." }),
    
  category: z.string()
    .trim()
    .min(1, { message: "Please specify a category." })
    .min(3, { message: "Category name must be at least 3 characters." })
    .max(20, { message: "Category name cannot exceed 20 characters." }),
    
  pitch: z.string()
    .trim()
    .min(1, { message: "We need your pitch!" })
    .min(20, { message: "Your pitch needs a bit more detail." })
    .max(1000 ,{ message: "Pitch too long"}),
  
  file: baseImageValidator
    .refine((file) => file && file.size > 0, "A startup image is required."),
});

// The Profile Settings Form (Image is optional)
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),

  // We use the base validator, but don't force a size > 0 check
  avatar: baseImageValidator,
});
