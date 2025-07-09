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
import { SuperAdminCompanyUserProps } from "@/types/super-admin/user";
import {
  Calendar,
  Copy,
  Eye,
  IdCard,
  LetterText,
  Loader,
  Mail,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type ViewSuperAdminDialogProps = {
  user: SuperAdminCompanyUserProps;
};

function ViewSuperAdminDialog({ user }: ViewSuperAdminDialogProps) {
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
          <SheetTitle>Super Admin Company</SheetTitle>
          <SheetDescription>
            Details for the selected Super Admin Company User
          </SheetDescription>
        </SheetHeader>

        {/* Super Admin Details Content */}
        <div className="space-y-6 p-4">
          <div className="flex items-center gap-2">
            <Image
              src={
                getImageUrl(user.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={user.name}
              width={80}
              height={80}
              className="size-8 rounded-full border-2 object-cover md:size-10"
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                {user.id}
                <span
                  title="Copy ID"
                  onClick={() => handleCopyClick(user.id)}
                  className="cursor-pointer duration-200 hover:text-gray-600"
                >
                  <Copy strokeWidth={2} size={16} />
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Mail size={14} />
                <p>Email</p>
              </div>
              <p>{user.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Loader size={14} />
                <p>Status</p>
              </div>
              <p
                className={`font-semibold ${user.isActive ? "text-green-500" : "text-gray-400"}`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                <p>Joined</p>
              </div>
              <p>{formatDate(user.createdAt)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-lg font-medium">Company Details</h4>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <IdCard size={14} />
                <p>Company ID</p>
              </div>
              <p>{user.company.id ?? "-"}</p>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Company Name</p>
              </div>
              <p className="font-semibold">{user.company.name ?? "-"}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewSuperAdminDialog;
