import { useEffect, useState } from "react";

function useUserCountry() {
  const [country, setCountry] = useState("");

  useEffect(() => {
    const userCountry = localStorage.getItem("user-country");

    if (!userCountry) {
      fetch("https://get.geojs.io/v1/ip/country.json")
        .then((res) => res.json())
        .then(
          (data: {
            country: string;
            country_3: string;
            ip: string;
            name: string;
          }) => {
            setCountry(data.country);
            localStorage.setItem("user-country", data.country);
          },
        )
        .catch((error) => console.log(error));
    } else {
      // Syncing React state from localStorage, which is an external store
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountry(userCountry);
    }
  }, []);

  return { country };
}

export default useUserCountry;
