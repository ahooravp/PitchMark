"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDeditor from "@uiw/react-md-editor";
import { Send, ImagePlus, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch, editPitch, uploadStartupImage } from "@/lib/actions";
import { startupSchema } from "@/lib/validation";
import { STARTUP_BY_ID_QUERY_RESULT } from "@/sanity.types";

type StartupFormProps = NonNullable<STARTUP_BY_ID_QUERY_RESULT>;
export type FormStatus = "INITIAL" | "SUCCESS" | "ERROR";

export interface FormState {
  error: string;
  status: FormStatus;
  values?: Record<string, string>;
}

const StartupForm = ({ initialData }: { initialData?: StartupFormProps }) => {
  // Fully Controlled Inputs
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [pitch, setPitch] = useState(initialData?.pitch || "");

  // File Tracking States
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [assetId, setAssetId] = useState<string | null>(null);

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();
  const router = useRouter();

  // 1. The Background File Uploader with Progressive Simulator
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        file: "Image must be smaller than 5MB.",
      }));
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setErrors((prev) => ({ ...prev, file: "" }));

    setIsFileUploading(true);
    setUploadProgress(0);

    // Start the visual progress simulation
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return 90; // Hold at 90% while awaiting server
        return prev + 5;
      });
    }, 200);

    try {
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);

      // Execute the decoupled transfer to Sanity
      const result = await uploadStartupImage(uploadData);

      clearInterval(progressInterval);

      if (result.success && result.assetId) {
        setAssetId(result.assetId);
        setUploadProgress(100); // Snap strictly to 100 on success
      } else {
        setErrors((prev) => ({
          ...prev,
          file: result.error || "Upload failed.",
        }));
        setFileName("");
        setFile(null);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Background Upload Error:", error);
      clearInterval(progressInterval);
      setErrors((prev) => ({ ...prev, file: "Network error during upload." }));
      setFileName("");
      setFile(null);
      setUploadProgress(0);
    } finally {
      setIsFileUploading(false);
    }
  };

  // 2. The Final Form Submission
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const isEditMode = !!initialData;
    const hasNewFile = file && file.size > 0;

    const rawData = { title, description, category, pitch, file };

    const validationResult =
      isEditMode && !hasNewFile
        ? startupSchema.omit({ file: true }).safeParse(rawData)
        : startupSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const formattedErrors = Object.keys(fieldErrors).reduce(
        (acc, key) => {
          acc[key] = fieldErrors[key as keyof typeof fieldErrors]?.[0] || "";
          return acc;
        },
        {} as Record<string, string>,
      );

      setErrors(formattedErrors);
      return;
    }

    if (!isEditMode && !assetId) {
      setErrors((prev) => ({
        ...prev,
        file: "Please wait for the image to finish uploading.",
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      if (assetId) {
        formData.append("assetId", assetId);
      }

      const dummyState: FormState = { error: "", status: "INITIAL" };

      const result = isEditMode
        ? await editPitch(dummyState, formData, pitch, initialData._id)
        : await createPitch(dummyState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: isEditMode ? "Startup updated!" : "Startup created!",
        });

        // Wipe clean explicitly
        setTitle("");
        setDescription("");
        setCategory("");
        setPitch("");
        setFile(null);
        setFileName("");
        setAssetId(null);
        setUploadProgress(0);

        router.push(`/startup/${result._id}`);
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Please check your inputs.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Mutation Error:", error);
      toast({
        title: "Error",
        description: "An unexpected database error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="startup-form" noValidate>
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <p
          className={`text-sm mt-2 ml-2 font-medium ${description.trim().length > 500 ? "text-red-500" : "text-black-100/70"}`}
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          className={`flex flex-col items-center justify-center w-full h-32 px-4 mt-3 transition-all bg-white/5 backdrop-blur-md border-2 border-dashed rounded-xl ${isFileUploading ? "border-primary/50" : "border-black/10 hover:bg-primary/5 hover:border-primary/50"} cursor-pointer overflow-hidden relative group`}
        >
          <div className="flex flex-col items-center justify-center text-center z-10">
            {isFileUploading ? (
              <Loader2 className="w-8 h-8 mb-3 text-primary animate-spin" />
            ) : assetId ? (
              <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
            ) : (
              <ImagePlus className="w-8 h-8 mb-3 text-primary/80 group-hover:scale-110 transition-transform" />
            )}

            <p className="text-sm text-black-200 mb-1">
              {isFileUploading ? (
                <span className="font-semibold text-primary">Uploading...</span>
              ) : fileName ? (
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

            {/* The restored, dynamically hidden helper text */}
            {!isFileUploading && !fileName  && (
              <p className="text-xs text-black-100/60 font-medium">
                JPG, PNG, or WebP (max. 5MB){" "}
              </p>
            )}
          </div>

          <Input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            className="hidden"
            required={!initialData}
            disabled={isFileUploading}
            onChange={handleImageChange}
          />

          {/* Clean, progressively filling bar */}
          {(isFileUploading || assetId) && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/5">
              <div
                className={`h-full transition-all duration-300 ease-out ${assetId ? "bg-green-500" : "bg-primary"}`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
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
        <p
          className={`text-sm mt-2 ml-2 font-medium ${pitch.trim().length > 1000 ? "text-red-500" : "text-black-100/70"}`}
        >
          {pitch.trim().length}/1000 characters (minimum 20)
        </p>
        {errors.pitch && (
          <p className="startup-form_error mt-2 text-red-500 text-sm">
            {errors.pitch}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="startup-form_btn text-white flex justify-center items-center relative overflow-hidden"
        disabled={isSubmitting || isFileUploading}
      >
        <span className="relative z-10 flex items-center">
          {isSubmitting
            ? "Submitting..."
            : initialData
              ? "Update Startup"
              : "Submit Your Pitch"}
          {!isSubmitting && <Send className="size-6 ml-2" />}
        </span>
      </button>
    </form>
  );
};

export default StartupForm;
