//src/components/navbar.tsx
import { UserButton, useUser } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from './ui/navigation-menu';
import { navigationMenuTriggerStyle } from "./ui/navigation-menu"
import Link from "next/link";

const Navbar = () => {

  const { user } = useUser();

  return (
    <div className="fixed top-0 right-4 z-50">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className={navigationMenuTriggerStyle()} >
            <Link href={`/dashboard/${user?.id || 'default'}`}>Exercise Dashboard</Link>
          </NavigationMenuItem>
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <Link href={`/`}>Dashboard</Link>
          </NavigationMenuItem>
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <UserButton afterSignOutUrl="/" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
