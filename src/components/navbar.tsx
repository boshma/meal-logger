//src/components/navbar.tsx
import { useClerk } from "@clerk/nextjs";

const Navbar = () => {
  const { signOut } = useClerk();

  // Define the sign out handler
  const handleSignOut = () => {
    signOut().catch((error) => {
      console.error("Failed to sign out", error);
    });
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Fitache</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <button onClick={handleSignOut}>Sign Out</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
