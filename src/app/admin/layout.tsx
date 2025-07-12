// src/app/admin/layout.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({
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
        <div className="mr-auto flex items-center gap-2">
          <Link className="text-lg hover:undelrine font-bold" href={"/"}>
            Flabingo
          </Link>
          <Badge>Admin</Badge>
        </div>
        <Link
          href={"/admin/courses"}
          className="hover:bg-accent/10 flex items-center px-2"
        >
          Courses
        </Link>
        <Link
          href={"/admin/products"}
          className="hover:bg-accent/10 flex items-center px-2"
        >
          Products
        </Link>
        <Link
          href={"/admin/sales"}
          className="hover:bg-accent/10 flex items-center px-2"
        >
          Sales
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
        <SignedOut>
          <Button className="self-center" asChild>
            <SignInButton>Sign In</SignInButton>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}

// async function AdminLink() {
//   const user = await getCurrentUser();
//   if (!canAccessAdminPages(user)) return null;
//   return (
//     <Link href={"/admin"} className="hover:bg-accent/10 flex items-center px-2">
//       Admin
//     </Link>
//   );
// }
