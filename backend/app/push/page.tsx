import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin_auth";

import AuthPage from "@/components/AuthPage";
import PushManager from "@/components/PushManager";

export default async function Push() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        !!session ? (
          <PushManager />
        ) : (
          <AuthPage />
        )
      }
    </main>
  )
};
