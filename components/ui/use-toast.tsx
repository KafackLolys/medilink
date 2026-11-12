"use client";

import React from "react";
import { toast, Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function useToast() {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }) => {
      return toast(props.description || props.title || "", {
        ...props,
        action: props.action,
      });
    },
  };
}

export { useToast, type ToasterProps };

export function Toaster(props: ToasterProps) {
  return <SonnerToaster {...props} />;
}
