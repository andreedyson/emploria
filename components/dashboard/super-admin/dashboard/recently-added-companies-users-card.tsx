import RecentlyAddedCompaniesList from "@/components/lists/recently-added-companies-list";
import RecentlyAddedUsersList from "@/components/lists/recently-added-users-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RecentlyAddedCompaniesProps,
  RecentlyAddedUsersProps,
} from "@/types/super-admin/dashboard";
import { Building, CalendarPlus, Plus, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type RecentlyAddedCompaniesUserscardProps = {
  recentlyAddedUsers: RecentlyAddedUsersProps[];
  recentlyAddedCompanies: RecentlyAddedCompaniesProps[];
};

function RecentlyAddedCompaniesUserscard({
  recentlyAddedUsers,
  recentlyAddedCompanies,
}: RecentlyAddedCompaniesUserscardProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-1.5">
          <CalendarPlus className="size-8" />
          <div>
            <CardTitle>Recently Added</CardTitle>
            <CardDescription>
              Showing recently added Users and Companies
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="h-full w-full">
          <div className="w-full">
            <TabsList className="w-[160px]">
              <TabsTrigger value="users" className="w-full" title="New Users">
                <Users2 size={20} />
              </TabsTrigger>
              <TabsTrigger
                value="companies"
                className="w-full"
                title="New Companies"
              >
                <Building size={20} />
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="users" className="mt-2 grid grid-cols-1 gap-4">
            {recentlyAddedUsers.length > 0 ? (
              recentlyAddedUsers.map((user, i) => (
                <RecentlyAddedUsersList key={i} user={user} />
              ))
            ) : (
              <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
                <Image
                  src={"/assets/empty-recent-users.svg"}
                  width={500}
                  height={300}
                  alt="Users Not Found"
                  className="aspect-video w-[180px] lg:w-[280px]"
                  priority
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold md:text-base">
                    No Users Found
                  </h4>
                  <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                    Showing the list of recently added users from the past one
                    month.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className="flex items-center gap-2"
                    >
                      <Plus />
                      <Link href={"/dashboard/super-admin/user"}>Add User</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="companies"
            className="mt-2 grid h-full grid-cols-1 gap-4"
          >
            {recentlyAddedCompanies.length > 0 ? (
              recentlyAddedCompanies.map((company, i) => (
                <RecentlyAddedCompaniesList key={i} company={company} />
              ))
            ) : (
              <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
                <Image
                  src={"/assets/empty-recent-companies.svg"}
                  width={500}
                  height={300}
                  alt="Companies Not Found"
                  className="aspect-video w-[180px] lg:w-[280px]"
                  priority
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold md:text-base">
                    No Companies Found
                  </h4>
                  <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                    Showing the list of recently added companies from the past
                    one month.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      className="flex items-center gap-2"
                    >
                      <Plus />
                      <Link href={"/dashboard/super-admin/company"}>
                        Add Company
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default RecentlyAddedCompaniesUserscard;
