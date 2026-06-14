"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDeditor from "@uiw/react-md-editor";
import { Send, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch, editPitch } from "@/lib/actions";
import { startupSchema } from "@/lib/validation"; // Import the strict modular schema

const StartupForm = ({ initialData }: { initialData?: any }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(initialData?.pitch || ""); 
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    const file = formData.get("file") as File;
    const isEditMode = !!initialData;
    const hasNewFile = file && file.size > 0;

    // 1. Extract raw data into a clean object
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      pitch,
      file,
    };

    // 2. Bulletproof Conditional Validation
    // If editing and no new file was uploaded, we use .omit() to strip the strict file requirement
    // Otherwise, we enforce the full strict schema.
    const validationResult = (isEditMode && !hasNewFile)
      ? startupSchema.omit({ file: true }).safeParse(rawData)
      : startupSchema.safeParse(rawData);

    // 3. Handle failures linearly without throwing exceptions
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors(fieldErrors as unknown as Record<string, string>);
      toast({ title: "Validation Error", description: "Please check your inputs and try again.", variant: "destructive" });
      return { ...prevState, error: "Validation failed", status: "ERROR" };
    }

    try {
      // 4. Route the sanitized data to the correct server action
      const result = isEditMode 
        ? await editPitch(prevState, formData, pitch, initialData._id)
        : await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: isEditMode ? "Startup updated successfully!" : "Startup created successfully!",
        });
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      console.error("Mutation Error:", error);
      toast({ title: "Error", description: "An unexpected database error occurred.", variant: "destructive" });
      return { ...prevState, error: "An unexpected error occurred", status: "ERROR" };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "", status: "INITIAL", values: {},
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">Title</label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          defaultValue={initialData?.title || ""} 
        />
        {errors.title && <p className="startup-form_error mt-2 text-red-500 text-sm">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="startup-form_label">Description</label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          defaultValue={initialData?.description || ""} 
        />
        {errors.description && <p className="startup-form_error mt-2 text-red-500 text-sm">{errors.description}</p>}
      </div>
      
      <div>
        <label htmlFor="category" className="startup-form_label">Category</label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          defaultValue={initialData?.category || ""} 
        />
        {errors.category && <p className="startup-form_error mt-2 text-red-500 text-sm">{errors.category}</p>}
      </div>
      
      <div>
        <label htmlFor="file" className="startup-form_label">Startup Image</label>
        <label 
          htmlFor="file" 
          className="flex flex-col items-center justify-center w-full h-32 px-4 mt-3 transition-all bg-white/5 backdrop-blur-md border-2 border-dashed rounded-xl border-black/10 hover:bg-primary/5 hover:border-primary/50 cursor-pointer overflow-hidden relative"
        >
          <div className="flex flex-col items-center justify-center text-center z-10">
            <ImagePlus className="w-8 h-8 mb-3 text-primary/80" />
            <p className="mb-2 text-sm text-black-200">
              {fileName ? (
                 <span className="font-semibold text-primary">{fileName}</span>
              ) : initialData?.image ? (
                 <span className="font-semibold text-primary">Current image active. Click to replace.</span>
              ) : (
                <><span className="font-semibold">Click to upload</span> your thumbnail</>
              )}
            </p>
          </div>
          <Input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            className="hidden"
            required={!initialData} 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              }
            }}
          />
        </label>
        {errors.file && <p className="startup-form_error mt-2 text-red-500 text-sm">{errors.file}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">Pitch</label>
        <MDeditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
        />
        {errors.pitch && <p className="startup-form_error mt-2 text-red-500 text-sm">{errors.pitch}</p>}
      </div>

      <button
        type="submit"
        className="startup-form_btn text-white flex justify-center items-center"
        disabled={isPending || pitch.trim().length < 10}
      >
        {isPending ? "Submitting..." : (initialData ? "Update Startup" : "Submit Your Pitch")}
        <Send className="size-6 ml-2" />
      </button>
    </form>
  );
};

export default StartupForm;