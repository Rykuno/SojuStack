import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AvatarProps } from "@radix-ui/react-avatar";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

interface UserAvatarProps extends AvatarProps {
  user: {
    id: string;
    image: string | null | undefined;
  };
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  const avatar = createAvatar(funEmoji, {
    seed: user.id
  });

  return (
    <Avatar {...props}>
      <AvatarImage
        className="object-cover"
        alt="user avatar"
        src={user?.image || avatar.toDataUri()}
      />
      <AvatarFallback>
        <img alt="user avatar" src={avatar.toDataUri()} />
      </AvatarFallback>
    </Avatar>
  );
}
