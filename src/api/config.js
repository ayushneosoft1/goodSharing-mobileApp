// Comment / Uncomment or modify below URLs accordingly.

// When running in Expo Go Mobile App. This URL can change, can be seen in terminal when we do "npx expo start"
// config.js

// export const BASE_URL = "http://192.168.0.129:4000/graphql";

// When running in Web Browser.
// export const BASE_URL = "http://0.0.0.0:4000/graphql";

// ./api/config.js

import { Platform } from "react-native";

//  Your laptop LAN IP (change once if WiFi changes)
const LAN_IP = "192.168.0.129";

export const BASE_URL =
  Platform.OS === "web"
    ? "http://0.0.0.0:4000/graphql" // for browser
    : `http://${LAN_IP}:4000/graphql`; // for mobile
