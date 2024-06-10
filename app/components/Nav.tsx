import { useLocation } from "@remix-run/react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { NewEntryForm } from "~/components/NewEntryForm";

export const Nav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const { pathname } = useLocation();

  return (
    <NavigationMenu>
      <div className="w-full flex justify-between items-center">
        <NavigationMenuList className="space-x-4">
          <NavigationMenuItem>
            <NavigationMenuLink active={pathname === "/"} href="/">
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              active={pathname.includes("/posts")}
              href="/posts"
            >
              Posts
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              active={pathname.includes("/recipes")}
              href="/recipes"
            >
              Recipes
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {isAuthenticated && <NewEntryForm />}
      </div>
    </NavigationMenu>
  );
};
