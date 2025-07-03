import { Skeleton } from "../ui/skeleton";

function ProfilePageSkeletons() {
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-4">
        <Skeleton className="col-span-1 h-[450px] w-full" />
        <Skeleton className="col-span-1 h-[450px] w-full lg:col-span-3" />
      </div>
    </>
  );
}

export default ProfilePageSkeletons;
