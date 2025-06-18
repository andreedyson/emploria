import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import EditProfileDialog from "@/components/dashboard/user/profile/edit-profile-dialog";
import UserProfileAvatar from "@/components/dashboard/user/profile/user-profile-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserProfileData } from "@/lib/data/user/profile";
import { calculateAge, formatDate } from "@/lib/utils";
import { Gender } from "@prisma/client";
import {
  Briefcase,
  Building,
  Building2,
  Calendar1,
  CalendarCheck,
  Contact,
  Hash,
  IdCard,
  MapPinHouse,
  MarsStroke,
  PhoneCall,
  UserCheck,
  UserCog,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

async function UserProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const userProfile = await getUserProfileData(userId);
  const userAge = calculateAge(userProfile?.dateOfBirth as Date);
  return (
    <section className="w-full space-y-4">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Employee Profile */}
        <div className="relative col-span-1 w-full rounded-md">
          <div className="relative rounded-t-md">
            <Image
              src={"/assets/employee-profile-gradient.jpg"}
              width={400}
              height={200}
              alt="Employee Profile Gradient"
              className="h-[150px] w-full rounded-t-md"
            />
            <div className="absolute inset-0 rounded-t-md bg-black/40" />
          </div>
          <div className="mt-[-3rem] w-full px-3 lg:absolute lg:top-48">
            <div className="-mt-12 flex justify-center lg:justify-start">
              <UserProfileAvatar
                userId={userId}
                name={userProfile?.name}
                image={userProfile?.image}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold">{userProfile?.name}</h4>
                <p className="text-muted-foreground text-sm font-medium">
                  {userProfile?.email}
                </p>
              </div>
              <EditProfileDialog
                userId={userId}
                defaultValues={{
                  name: userProfile?.name ?? "",
                  phone: userProfile?.phone ?? "",
                  address: userProfile?.address ?? "",
                  gender: userProfile?.gender as Gender,
                  dateOfBirth: userProfile?.dateOfBirth,
                }}
              />
            </div>
            <div className="mt-3">
              <p className="font-semibold">User Information</p>
              <div className="mt-2 space-y-4 lg:space-y-3">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <IdCard size={20} />
                  <div>
                    <p className="font-medium">User ID</p>
                    <p className="text-foreground line-clamp-1 font-semibold">
                      {userProfile?.id}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MapPinHouse size={20} />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-foreground line-clamp-1 font-semibold">
                      {userProfile?.address}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <PhoneCall size={20} />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-foreground line-clamp-1 font-semibold">
                      {userProfile?.phone}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MarsStroke size={20} />
                  <div>
                    <p className="font-medium">Gender</p>
                    <p className="text-foreground line-clamp-1 font-semibold">
                      {userProfile?.gender}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <UserCheck size={20} />
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-foreground line-clamp-1 font-semibold">
                      {userProfile?.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Profile Details */}
        <Card className="col-span-1 space-y-2 rounded-md border lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-semibold">Employee Details</CardTitle>
            <CardDescription>
              An overview of your employment information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 place-items-center gap-4">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Building size={20} />
                <div>
                  <p className="font-medium">Company</p>
                  <p className="text-foreground line-clamp-1 font-semibold">
                    {userProfile?.company.name}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Building2 size={20} />
                <div>
                  <p className="font-medium">Department</p>
                  <p className="text-foreground line-clamp-1 font-semibold">
                    {userProfile?.department.name}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Contact size={20} />
                  <p className="font-medium">Employee ID</p>
                </div>
                <p className="text-foreground line-clamp-1 font-semibold">
                  {userProfile?.employee.id}
                </p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Briefcase size={20} />
                  <p className="font-medium">Position</p>
                </div>
                <p className="text-foreground line-clamp-1 font-semibold">
                  {userProfile?.employee.position}
                </p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <UserCog size={20} />
                  <p className="font-medium">Role</p>
                </div>
                <p className="text-foreground line-clamp-1 font-semibold">
                  {userProfile?.employee.role}
                </p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar1 size={20} />
                  <p className="font-medium">Date of Birth</p>
                </div>
                <p className="text-foreground line-clamp-1 font-semibold">
                  {userProfile?.dateOfBirth
                    ? formatDate(userProfile?.dateOfBirth)
                    : "-"}
                </p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Hash size={20} />
                  <p className="font-medium">Age</p>
                </div>
                <p className="text-foreground line-clamp-1 font-semibold">
                  {userAge} years old
                </p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <CalendarCheck size={20} />
                  <p className="font-medium">Joined</p>
                </div>
                <p className="text-foreground line-clamp-1 font-semibold">
                  {userProfile?.dateOfBirth
                    ? formatDate(userProfile?.joinedDate)
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default UserProfilePage;
