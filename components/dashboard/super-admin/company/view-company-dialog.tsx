import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getImageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { AllCompaniesProps } from "@/types/super-admin/company";
import { Calendar, Copy, Eye, IdCard, LetterText } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type ViewCompanyDialogProps = {
  company: AllCompaniesProps;
};

function ViewCompanyDialog({ company }: ViewCompanyDialogProps) {
  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", {
        id: "clipboard",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-indigo-500 text-white duration-200 hover:bg-indigo-600"
        >
          <Eye size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Company</SheetTitle>
          <SheetDescription>Details for the selected Company.</SheetDescription>
        </SheetHeader>

        {/* Company Details Content */}
        <div className="space-y-6 p-4">
          <div className="flex items-center gap-2">
            <Image
              src={
                getImageUrl(company.image as string, "companies") ||
                "/assets/image-placeholder.svg"
              }
              alt={company.name}
              width={80}
              height={80}
              className="size-8 rounded-full border-2 object-contain md:size-10"
            />
            <div>
              <p className="text-lg font-semibold">{company.name}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <IdCard size={14} />
                <p>Company ID</p>
              </div>
              <p className="flex items-center gap-1 text-sm">
                {company.id}
                <span
                  title="Copy ID"
                  onClick={() => handleCopyClick(company.id)}
                  className="cursor-pointer duration-200 hover:text-gray-600"
                >
                  <Copy strokeWidth={2} size={16} />
                </span>
              </p>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Company Name</p>
              </div>
              <p className="font-semibold">{company.name}</p>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                <p>Created</p>
              </div>
              <p className="font-semibold">{formatDate(company.createdAt)}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewCompanyDialog;
