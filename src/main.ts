import axios from "axios";
import "leaflet/dist/leaflet.css";
import {
  map,
  latLng,
  tileLayer,
  MapOptions,
  marker,
  icon,
  Map,
  Marker,
} from "leaflet";
import "./style.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/700.css";

// Dom
const ipInput = <HTMLInputElement>document.querySelector("input");
const button = <HTMLButtonElement>document.querySelector("button");
const ipAddress = <HTMLHeadingElement>document.querySelector(".address");
const ipLocation = <HTMLHeadingElement>document.querySelector(".location");
const ipTimezone = <HTMLHeadingElement>document.querySelector(".timezone");
const ipIsp = <HTMLHeadingElement>document.querySelector(".isp");

let lat: number;
let lng: number;
let mymap: Map;

button.addEventListener("click", () => {
  axios
    .get(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        import.meta.env.VITE_Ipify_key
      }&ipAddress=${ipInput.value}`
    )
    .then((data) => {
      let ipData = data.data;
      console.log(ipData);

      let country = ipData.location.country;

      ipAddress.innerText = ipData.ip;
      ipLocation.innerText = ipData.location.region + " , " + country;
      ipTimezone.innerText = ipData.location.timezone;
      ipIsp.innerText = ipData.isp;

      lat = ipData.location.lat;
      lng = ipData.location.lng;

      const options: MapOptions = {
        center: latLng(lat, lng),
        zoom: 12,
      };

      if (!mymap) {
        mymap = map("map", options).setView([lat, lng], 13);
      } else {
        mymap.setView([lat, lng], 13);

        mymap.eachLayer((layer) => {
          if (layer instanceof Marker) {
            mymap.removeLayer(layer);
          }
        });

        const mapIcon = icon({
          iconUrl: "/images/icon-location.svg",
        });

        // Add a new marker with the updated coordinates
        marker([lat, lng], { icon: mapIcon }).addTo(mymap);
      }

      tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mymap);

      const mapIcon = icon({
        iconUrl: "/images/icon-location.svg",
      });

      marker([lat, lng], { icon: mapIcon }).addTo(mymap);
    });

  ipInput.value = "";
});
