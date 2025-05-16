import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SubmitButtonType = {
  children: React.ReactNode;
  isSubmitting: boolean;
  className?: string;
};

export function SubmitButton({
  children,
  isSubmitting,
  className,
  ...props
}: SubmitButtonType) {
  return (
    <Button disabled={isSubmitting} {...props} className={className}>
      <span>{children}</span>

      {isSubmitting && (
        <div className="flex items-center pl-3">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}
    </Button>
  );
}
