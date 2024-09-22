import { api } from "~/utils/api";

function usePlan() {
  const getUserPlan = api.user.getUserPlan.useQuery();

  return getUserPlan.data;
}

export { usePlan };
