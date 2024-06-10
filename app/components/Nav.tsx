import { Link, useLocation } from "@remix-run/react";

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
            <NavigationMenuLink active={pathname === "/"} asChild>
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink active={pathname.includes("/posts")} asChild>
              <Link to="/posts">Posts</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink active={pathname.includes("/recipes")} asChild>
              <Link to="/recipes">Recipes</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {isAuthenticated && <NewEntryForm />}
      </div>
    </NavigationMenu>
  );
};
