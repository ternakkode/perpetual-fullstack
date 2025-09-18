"use client";

import { type ExternalToast, toast } from "sonner";
import { AlertTriangle, CheckCircle, XClose } from "@untitled-ui/icons-react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

import { cn } from "@brother-terminal/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return <Sonner theme={theme as ToasterProps["theme"]} {...props} />;
};

export { Toaster };

const Toast = ({
  id,
  title,
  type,
}: {
  id: string | number;
  title: string;
  type: "error" | "success";
}) => {
  const Icon = type === "error" ? AlertTriangle : CheckCircle;
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 rounded-lg border",
        type === "error" && "bg-[#211F24] border-danger/10",
        type === "success" && "bg-[#122729] border-primary/10"
      )}
    >
      <Icon
        className={cn(
          "size-4 md:size-6",
          type === "error" && "text-danger",
          type === "success" && "text-primary"
        )}
      />
      <p className="flex-1 md:text-md">{title}</p>
      <button aria-label="Close Notification" onClick={() => toast.dismiss(id)}>
        <XClose className="text-white-48 size-4" />
      </button>
    </div>
  );
};

export const useToaster = () => {
  function fn(type: "error" | "success", title: string, opts?: ExternalToast) {
    toast.custom((id) => <Toast id={id} type={type} title={title} />, opts);
  }

  return {
    error: (title: string, opts?: ExternalToast) => fn("error", title, opts),
    success: (title: string, opts?: ExternalToast) =>
      fn("success", title, opts),
  };
};
