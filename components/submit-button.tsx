import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SubmitButtonType = {
  children: React.ReactNode;
  isSubmitting: boolean;
  className?: string;
  onClick?: () => void;
};

export function SubmitButton({
  children,
  isSubmitting,
  className,
  onClick,
  ...props
}: SubmitButtonType) {
  return (
    <Button
      disabled={isSubmitting}
      {...props}
      className={className}
      onClick={onClick}
      type="submit"
    >
      <span>{children}</span>

      {isSubmitting && (
        <div className="flex items-center pl-1.5">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}
    </Button>
  );
}
