import { useMediaQuery as useDotDevMediaQuery } from "@uidotdev/usehooks";

function useMediaQuery() {
  const smOrHigher = useDotDevMediaQuery("(min-width: 640px)");
  const mdOrHigher = useDotDevMediaQuery("(min-width: 768px)");
  const lgOrHigher = useDotDevMediaQuery("(min-width: 1024px)");
  const xlOrHigher = useDotDevMediaQuery("(min-width: 1280px)");
  const xxlOrHigher = useDotDevMediaQuery("(min-width: 1536px)");

  return { smOrHigher, mdOrHigher, lgOrHigher, xlOrHigher, xxlOrHigher };
}

export { useMediaQuery };
