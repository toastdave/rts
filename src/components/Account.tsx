import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const Account = ({
  name,
  image,
  loggedIn,
}: {
  name: string;
  image: string;
  loggedIn: boolean;
}) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Avatar data-testid='avatar'>
            {loggedIn ? (
              image ? (
                <AvatarImage src={image} />
              ) : (
                <AvatarImage src="https://i1.sndcdn.com/artworks-mVzibIwATVPLVzuL-f5yD0Q-t500x500.jpg" />
              )
            ) : (
              <AvatarFallback></AvatarFallback>
            )}

            {loggedIn ? (
              name ? (
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              ) : (
                <AvatarFallback></AvatarFallback>
              )
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2 bg-neutral-900 text-white">
            {loggedIn ? (
              <Button
                data-testid="logout-button"
                className="p-2 hover:cursor-pointer"
                onClick={() =>
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/login";
                      },
                    },
                  })
                }
              >
                Logout
              </Button>
            ) : (
              <a href="/login" className="hover:cursor-pointer">
                Login
              </a>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Account;
