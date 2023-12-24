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
  circle,
  popup,
} from "leaflet";
import "./style.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/700.css";

// Dom
const ipInput = <HTMLInputElement>document.querySelector("input");
const button = <HTMLButtonElement>document.querySelector("button");
const ipAddress = <HTMLParagraphElement>document.querySelector(".address");
const ipLocation = <HTMLParagraphElement>document.querySelector(".location");
const ipTimezone = <HTMLParagraphElement>document.querySelector(".timezone");
const ipIsp = <HTMLParagraphElement>document.querySelector(".isp");

let lat: number;
let lng: number;
let mymap: Map;

interface location {
  ip: string;
  isp: string;
  location: {
    country: string;
    lat: number;
    lng: number;
    region: string;
    timezone: string;
  };
}

button.addEventListener("click", () => {
  function isValidIpAddress(ipAddress: string) {
    // Simple validation: Check if the input looks like a valid IPv4 address
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(ipAddress);
  }

  if (isValidIpAddress(ipInput.value)) {
    axios
      .get<location>(
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

        circle([lat, lng], {
          color: "blue",
          fillColor: "#39B6FF",
          fillOpacity: 0.5,
          radius: 500,
        }).addTo(mymap);

        popup()
          .setLatLng([lat, lng])
          .setContent("This is where you are located")
          .openOn(mymap);
      });
  } else {
    alert("You Need To Put An Ip Address For It To Work");
  }

  ipInput.value = "";
});