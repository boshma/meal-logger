//src/components/navbar.tsx
import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from './navigation-menu';
import { navigationMenuTriggerStyle } from "./navigation-menu"
import Link from "next/link";

const Navbar = () => {
  const { signOut } = useClerk();
  const { user } = useUser();



  return (
    <div className="fixed top-0 right-4 z-50">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className={navigationMenuTriggerStyle()} >
            <Link href={`/profile/${user?.fullName || 'default'}`}>Profile</Link>
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
