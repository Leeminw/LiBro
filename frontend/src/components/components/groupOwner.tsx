import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupOwner {
  profileUrl: string | null;
  nickName: string;
  children?: React.ReactNode;
}

export default function GroupOwner(props: GroupOwner) {
  const { profileUrl, nickName, children } = props;

  return (
    <div className="flex items-center h-full bg-white justify-between p-2 border rounded-md w-full">
      <div className="flex items-center space-x-2 w-full">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={profileUrl || "https://github.com/shadcn.png"}
            alt="@defaultUser"
          />
          <AvatarFallback>{nickName}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-nowrap w-full">{nickName}</span>
        {children}
      </div>
    </div>
  );
}
