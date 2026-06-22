"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDeditor from "@uiw/react-md-editor";
import { Send, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch, editPitch } from "@/lib/actions";
import { startupSchema } from "@/lib/validation";
import { STARTUP_BY_ID_QUERY_RESULT } from "@/sanity.types";

// 1. Strict Types
type StartupFormProps = NonNullable<STARTUP_BY_ID_QUERY_RESULT>;
export type FormStatus = "INITIAL" | "SUCCESS" | "ERROR";

export interface FormState {
  error: string;
  status: FormStatus;
  values?: Record<string, string>; // Keeps the uncontrolled input values safe if validation fails
}

const StartupForm = ({ initialData }: { initialData?: StartupFormProps }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(initialData?.pitch || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // 2. The Server Action
  const handleFormSubmit = async (
    prevState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const file = formData.get("file") as File;
    const isEditMode = !!initialData;
    const hasNewFile = file && file.size > 0;

    const rawData = {
      title: formData.get("title") as string,
      description, // Uses the React state directly
      category: formData.get("category") as string,
      pitch, // Uses the React state directly
      file,
    };

    const validationResult =
      isEditMode && !hasNewFile
        ? startupSchema.omit({ file: true }).safeParse(rawData)
        : startupSchema.safeParse(rawData);

    // LOCAL ERRORS: Show red text, keep the data, DO NOT fire a toast
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      // Safely extract the first error string for each field
      const formattedErrors = Object.keys(fieldErrors).reduce(
        (acc, key) => {
          acc[key] = fieldErrors[key as keyof typeof fieldErrors]?.[0] || "";
          return acc;
        },
        {} as Record<string, string>,
      );

      setErrors(formattedErrors);

      return {
        ...prevState,
        error: "Please fix the highlighted fields.",
        status: "ERROR",
        values: {
          title: rawData.title as string,
          category: rawData.category as string,
        },
      };
    }

    // Clear any old red text before talking to the server
    setErrors({});

    try {
      const result = isEditMode
        ? await editPitch(prevState, formData, pitch, initialData._id)
        : await createPitch(prevState, formData, pitch);

      // GLOBAL SUCCESS: Fire the green toast
      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: isEditMode
            ? "Startup updated successfully!"
            : "Startup created successfully!",
        });
        router.push(`/startup/${result._id}`);
      }

      return result as FormState;
    } catch (error) {
      console.error("Mutation Error:", error);
      // GLOBAL ERROR: The database crashed. Fire the red toast.
      toast({
        title: "Error",
        description: "An unexpected database error occurred.",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  // 3. The Form Hook
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
    values: {},
  });

  return (
    <form action={formAction} className="startup-form" noValidate>
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          // Prioritize: 1. Unsaved text (if error), 2. Database data, 3. Empty string
          defaultValue={state.values?.title || initialData?.title || ""}
        />
        {errors.title && (
          <p className="startup-form_error mt-2 text-red-500 text-sm">
            {errors.title}
          </p>
        )}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Description Character Counter */}
        <p
          className={`text-sm mt-2 ml-2 font-medium ${
            description.trim().length > 500
              ? "text-red-500"
              : "text-black-100/70"
          }`}
        >
          {description.trim().length}/500 characters (minimum 10)
        </p>

        {errors.description && (
          <p className="startup-form_error mt-2 text-red-500 text-sm">
            {errors.description}
          </p>
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
          defaultValue={state.values?.category || initialData?.category || ""}
        />
        {errors.category && (
          <p className="startup-form_error mt-2 text-red-500 text-sm">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="file" className="startup-form_label">
          Startup Image
        </label>
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
                <span className="font-semibold text-primary">
                  Current image active. Click to replace.
                </span>
              ) : (
                <>
                  <span className="font-semibold">Click to upload</span> your
                  thumbnail
                </>
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
        {errors.file && (
          <p className="startup-form_error mt-2 text-red-500 text-sm">
            {errors.file}
          </p>
        )}
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
        />

        {/* Pitch Character Counter */}
        <p
          className={`text-sm mt-2 ml-2 font-medium ${
            pitch.trim().length > 1000 ? "text-red-500" : "text-black-100/70"
          }`}
        >
          {pitch.trim().length}/1000 characters (minimum 10)
        </p>

        {errors.pitch && (
          <p className="startup-form_error mt-2 text-red-500 text-sm">
            {errors.pitch}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="startup-form_btn text-white flex justify-center items-center"
        disabled={isPending}
      >
        {isPending
          ? "Submitting..."
          : initialData
            ? "Update Startup"
            : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </button>
    </form>
  );
};

export default StartupForm;
