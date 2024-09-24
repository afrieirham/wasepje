import { useRouter } from "next/router";
import { useEffect } from "react";

import { useUser } from "@clerk/nextjs";

import { api } from "@/utils/api";

function usePlan() {
  const router = useRouter();
  const { user } = useUser();
  const getUserPlan = api.user.getUserPlan.useQuery();

  useEffect(() => {
    void getUserPlan.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  return getUserPlan.data;
}

export { usePlan };
