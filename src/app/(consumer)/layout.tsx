// src/app/(consumer)/layout.tsx
import { ThemeToggle } from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <div className="flex flex-col items-center">
        <Navbar />
        {children}
      </div>
    </>
  );
}

function Navbar() {
  return (
    <header className="w-full flex h-12 shadow bg-background z-10 justify-center">
      <nav className="container flex gap-4">
        <Link
          className="mr-auto text-lg hover:undelrine flex items-center font-bold"
          href={"/"}
        >
          Flabingo
        </Link>
        <div className="h-full flex items-center">
          <ThemeToggle />
        </div>
        <SignedIn>
          <AdminLink />

          <Link
            href={"/courses"}
            className="hover:bg-accent/10 flex items-center px-2"
          >
            My Courses
          </Link>
          <Link
            href={"/purchases"}
            className="hover:bg-accent/10 flex items-center px-2"
          >
            Purchase History
          </Link>
          <div className="size-8 self-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "100%", height: "100%" },
                },
              }}
            />
          </div>
        </SignedIn>
        <SignedOut>
          <Button className="self-center" asChild>
            <SignInButton>Sign In</SignInButton>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}

async function AdminLink() {
  const user = await getCurrentUser();
  if (!canAccessAdminPages(user)) return null;
  return (
    <Link href={"/admin"} className="hover:bg-accent/10 flex items-center px-2">
      Admin
    </Link>
  );
}
