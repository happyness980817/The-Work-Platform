import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/common/components/ui/navigation-menu";
import { Button } from "~/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  BellIcon,
  CalendarIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

const menus = [
  {
    name: "퍼실리테이터",
    to: "/",
  },
];

const languageMenu = {
  name: "언어",
  to: "/",
  items: [
    {
      name: "한국어",
      description: "",
      to: "/",
    },
    {
      name: "English",
      description: "",
      to: "/",
    },
  ],
};

export default function Navigation({
  isLoggedIn,
  hasNotifications,
  hasMessages,
  avatar,
  name,
  username,
}: {
  isLoggedIn: boolean;
  hasNotifications: boolean;
  hasMessages: boolean;
  avatar?: string | null;
  name?: string;
  username?: string;
}) {
  return (
    <nav className="flex px-6 md:px-10 lg:px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50 border-b border-border">
      <div className="flex items-center justify-start">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://thework.com/wp-content/uploads/2019/03/The-Work-app.jpg"
            alt="The Work"
            className="size-8 rounded"
          />
          <span className="text-lg font-bold tracking-tight">
            The Work
            <span className="text-primary font-normal italic"> Platform</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 hidden md:flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem key={menu.name}>
                <Link to={menu.to} className={navigationMenuTriggerStyle()}>
                  {menu.name}
                </Link>
              </NavigationMenuItem>
            ))}
            {isLoggedIn && (
              <NavigationMenuItem>
                <Link
                  to="/my/messages"
                  className={navigationMenuTriggerStyle()}
                >
                  대화 내역
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <Link to="/about" className={navigationMenuTriggerStyle()}>
                서비스 소개
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={languageMenu.to}>
                <NavigationMenuTrigger>
                  {languageMenu.name}
                </NavigationMenuTrigger>
              </Link>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  {languageMenu.items.map((item) => (
                    <li key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
                          to={item.to}
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/notifications">
              <BellIcon className="size-4" />
              {hasNotifications && (
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/chats">
              <MessageCircleIcon className="size-4" />
              {hasMessages && (
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                {avatar ? <AvatarImage src={avatar} /> : null}
                <AvatarFallback>{name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-medium">{name ?? "사용자"}</span>
                {username && (
                  <span className="text-xs text-muted-foreground">
                    @{username}
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/dashboard">
                    <CalendarIcon className="size-4 mr-2" />
                    예약
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/profile">
                    <UserIcon className="size-4 mr-2" />
                    프로필
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/settings">
                    <SettingsIcon className="size-4 mr-2" />
                    설정
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/auth/logout">
                  <LogOutIcon className="size-4 mr-2" />
                  로그아웃
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link to="/auth/login">로그인</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/join">회원가입</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
