import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { LogoutIcon, ProfileIcon } from "@/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfileMenu = ({ userPicture }: { userPicture: string }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("api/auth", {
      method: "DELETE",
    });

    if (response.status === 200) {
      router.push("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="show profile menu">
          <div className="relative h-10 w-10 rounded-full bg-blue-300">
            {userPicture && (
              <Image
                src={userPicture}
                alt="profile picture"
                fill
                className="rounded-full"
              />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-42" align="start">
        <DropdownMenuGroup className="grid gap-[5px]">
          <DropdownMenuItem className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple">
            <ProfileIcon />
            <span>Mi perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleLogout()}
            className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple"
          >
            <LogoutIcon />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ProfileMenu };
