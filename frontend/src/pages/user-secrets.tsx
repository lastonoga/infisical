import { useEffect } from "react";
import { useRouter } from "next/router";

export default function UserSecrets() {
  const router = useRouter();

  useEffect(() => {
    router.push(
      `${router.asPath.split("user-secrets")[0]}/org/${localStorage.getItem(
        "orgData.id"
      )}/user-secrets${router.asPath.split("user-secrets")[1]}`
    );
  }, []);

  return <div />;
}

UserSecrets.requireAuth = true;
