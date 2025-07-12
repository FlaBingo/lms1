"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

function actionToast({
  actionData,
  ...props
}: { actionData: { error: boolean; message: string } } & Parameters<
  typeof toast
>[1]) {
  return toast(actionData.error ? "Error" : "Success", {
    description: actionData.error,
    icon: actionData.error ? "❌" : "✅",
    action: {
      label: "close",
      onClick: () => console.log("close")
    },
    ...props,
  });
}

export { Toaster, actionToast };
