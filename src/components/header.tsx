import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto py-3 flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          <Link href="/">FileStorage</Link>
        </h1>
        <SignedIn>
          <Button variant="outline">
            <Link href="/dashboard/archivos">Tus archivos</Link>
          </Button>
        </SignedIn>
        <nav>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Ingresar</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2">
              <OrganizationSwitcher />
              <UserButton />
            </div>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Header;
