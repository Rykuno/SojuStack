import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AvatarProps } from "@radix-ui/react-avatar";
import { usersApi } from "~/utils/users";

interface UserAvatarProps extends AvatarProps {
  user: {
    id: string;
    image: string | null | undefined;
  };
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage
        className="h-full w-full object-cover"
        alt="user avatar"
        src={user?.image || ""}
      />
      <AvatarFallback>
        <svg
          className="w-full h-full object-cover"
          dangerouslySetInnerHTML={{
            __html: usersApi.getDefaultAvatar(user.id).toJson().svg
          }}
        />
      </AvatarFallback>
    </Avatar>
  );
}
