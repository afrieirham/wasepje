import { useSyncExternalStore } from "react";

// window isn't available on the server, so the server snapshot is empty and
// the real host is read after hydration
const subscribe = () => () => undefined;
const getSnapshot = () =>
  `${window.location.protocol}//${window.location.host}`;
const getServerSnapshot = () => "";

function useHostname() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export { useHostname };
