import { SignedIn, SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="flex gap-4 container">
        <Link
          className="mr-auto text-lg hover:undelrine px-2 flex items-center"
          href={"/"}
        >
          Flabingo
        </Link>
          <SignedIn>
            <Link
              href={"/courses"}
              className="hover:bg-accent/10 flex items-center px-2"
            >
              My Courses
            </Link>
            <Link
              href={"/courses"}
              className="hover:bg-accent/10 flex items-center px-2"
            >
              Purchase History
            </Link>
          </SignedIn>
      </nav>
    </header>
  );
}
