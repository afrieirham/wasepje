import { api } from "@/utils/api";

// Opens the Stripe customer portal as a session created for the signed-in user
function useManageBilling() {
  const portal = api.stripe.createBillingPortalSession.useMutation({
    onSuccess: ({ redirectUrl }) => {
      window.location.href = redirectUrl;
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return () => portal.mutate();
}

export { useManageBilling };
