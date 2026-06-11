"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDeditor from "@uiw/react-md-editor";
import { Send, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch, editPitch } from "@/lib/actions"; // Import both actions
import { z } from "zod";
import { formSchema } from "@/lib/validation";

// Optional initialData prop for when we are editing
const StartupForm = ({ initialData }: { initialData?: any }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(initialData?.pitch || ""); 
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    const file = formData.get("file") as File;
    
    // Conditional validation: If editing and no new file is added, bypass the strict file check
    const isEditMode = !!initialData;
    const hasNewFile = file && file.size > 0;

    try {
      // We manually validate the text fields here to avoid Zod throwing an error on the missing file during an edit
      const textValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        pitch,
      };

      // If creating new, OR if editing but they selected a new file, do full validation
      if (!isEditMode || hasNewFile) {
         await formSchema.parseAsync({ ...textValues, file });
      }

      // Route the data to the correct server action
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
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({ title: "Error", description: "Please check your inputs", variant: "destructive" });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
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
            // Remove 'required' if we are in edit mode
            required={!initialData} 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              }
            }}
          />
        </label>
        {errors.file && <p className="startup-form_error">{errors.file}</p>}
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