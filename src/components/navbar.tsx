//src/components/navbar.tsx
import { useClerk, useUser } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from './navigation-menu';
import { navigationMenuTriggerStyle } from "./navigation-menu"
import Link from "next/link";

const Navbar = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  // Define the sign out handler
  const handleSignOut = () => {
    signOut().catch((error) => {
      console.error("Failed to sign out", error);
    });
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>  
        <NavigationMenuItem>
        <button onClick={handleSignOut}>Sign Out</button>
        </NavigationMenuItem>
        <NavigationMenuItem>
        <Link href ={`/profile/${user?.fullName || 'default'}`}>Profile</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href ={`/`}>Dashboard</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
