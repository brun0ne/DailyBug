import BugLoader from "@/components/BugLoader";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin_auth";
import AuthPage from "@/components/AuthPage";

export default async function Admin() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        !!session ? (
          <BugLoader />
        ) : (
          <AuthPage />
        )
      }
    </main>
  )
};
