import { z } from "zod";

// Inside your formSchema
export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.string().min(3).max(20),
  pitch: z.string().min(10),
  
  // The Bulletproof File Validator
  file: z.any()
    // 1. Check if a file actually exists
    .refine((file) => file?.size > 0, "An image is required.")
    
    // 2. Security Check: Ensure the MIME type is strictly an image
    .refine((file) => file?.type.startsWith("image/"), "Only image files (JPG, PNG, SVG) are allowed.")
    
    // 3. Performance Check: Block massive files (e.g., max 5MB)
    // 5MB = 5 * 1024 kilobytes * 1024 bytes
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Image must be smaller than 5MB."),
});