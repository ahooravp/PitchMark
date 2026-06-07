"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDeditor from "@uiw/react-md-editor";
import { Send, ImagePlus } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";



const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(""); 
  const { toast } = useToast();
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    // 1. Removed 'link' and added 'file' for client-side structure
    const formValues = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      file: formData.get("file"), 
      pitch,
    };

    try {
      // 2. Validate against your updated Zod schema
      await formSchema.parseAsync(formValues);

      // 3. The formData object automatically carries the physical file to the server!
      const result = await createPitch(prevState, formData, pitch);

      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup has been created successfully",
        });
        router.push(`/startup/${result._id}`);
      }

      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return {
          ...prevState,
          error: "Validation failed",
          status: "ERROR",
          values: formValues, 
        };
      }

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
    values: {}, 
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
          defaultValue={state?.values?.title || ""} 
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup description"
          defaultValue={state?.values?.description || ""} 
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Finance, etc.)"
          defaultValue={state?.values?.category || ""} 
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>
      
      {/* --- THIS IS THE NEW FILE UPLOAD INPUT --- */}
<div>
  <label htmlFor="file" className="startup-form_label">
    Startup Image
  </label>
  
  {/* This label acts as the visual button */}
  <label 
    htmlFor="file" 
    className="flex flex-col items-center justify-center w-full h-32 px-4 mt-3 transition-all bg-white/5 backdrop-blur-md border-2 border-dashed rounded-xl border-black/10 hover:bg-primary/5 hover:border-primary/50 cursor-pointer"
  >
    <div className="flex flex-col items-center justify-center text-center">
      <ImagePlus className="w-8 h-8 mb-3 text-primary/80" />
      <p className="mb-2 text-sm text-black-200">
        {fileName ? (
           <span className="font-semibold text-primary">{fileName}</span>
        ) : (
          <>
            <span className="font-semibold">Click to upload</span> your thumbnail
          </>
        )}
      </p>
      {!fileName && <p className="text-xs text-black-300">SVG, PNG, or JPG</p>}
    </div>
    
    {/* The actual input is completely hidden! */}
    <Input
      id="file"
      name="file"
      type="file"
      accept="image/*"
      className="hidden"
      required
      onChange={(e) => {
        // Updates the state so the user sees the name of the file they picked
        if (e.target.files && e.target.files[0]) {
          setFileName(e.target.files[0].name);
        }
      }}
    />
  </label>
  
  {errors.file && <p className="startup-form_error">{errors.file}</p>}
</div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDeditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        <p className=" mt-2 text-sm text-gray-500">
          {pitch.length}/500 characters (minimum 10)
        </p>
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <button
        type="submit"
        className="startup-form_btn text-white flex justify-center items-center"
        disabled={isPending || pitch.trim().length < 10}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </button>
    </form>
  );
};

export default StartupForm;