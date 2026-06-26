"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteStartupAction } from "@/app/actions/deleteStartupAction";
import { useToast } from "@/hooks/use-toast"; 
import { useRouter } from "next/navigation";

export default function DeleteStartupButton({ 
  startupId, 
  authorId 
}: { 
  startupId: string; 
  authorId: string; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStartupAction(startupId, authorId);
      
      // 1. Fire the success toast
      toast({
        title: "Success",
        description: "Your pitch has been permanently deleted.",
      });

      // 2. Close the modal
      setIsOpen(false);
      
      // 3. Handle the routing safely on the client
      router.push("/");
      
    } catch (error) {
      console.error(error);
      
      // Fire the failure toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the pitch. Please try again.",
      });
      
      setIsDeleting(false); 
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        className="rounded-full mt-4 bg-transparent text-primary hover:bg-primary/10 transition-colors duration-300"
      >
        Delete
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-black-200 mb-3">
              Delete pitch?
            </h2>
            <p className="text-black-300 mb-8 leading-relaxed">
              Are you sure you want to delete this pitch?
            </p>
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="rounded-full px-6 hover:bg-gray-100 transition-colors duration-300"
              >
                Cancel
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full px-6 bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
}