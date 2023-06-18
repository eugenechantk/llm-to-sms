import clsx from "clsx";
import React from "react";

export default function Button({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 20px",
        gap: "4px",
        background: "linear-gradient(0deg, #262626 63.89%, #333333 100%)",
        border: "0.75px solid #595959",
        width: "fit-content",
      }}
      className={clsx(
        "rounded-full text-sm font-semibold hover:!bg-gradient-to-b hover:!from-theme-15 hover:!from-[64%] hover:!to-theme-25 hover:!to-[100%]",
        className,
      )}
    >
      {children}
    </button>
  );
}
