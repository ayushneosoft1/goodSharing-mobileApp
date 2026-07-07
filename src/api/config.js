import { Platform } from "react-native";

const LAN_IP = "192.168.0.128";

export const BASE_URL =
  Platform.OS === "web"
    ? `http://${LAN_IP}:4000/graphql`
    : `http://${LAN_IP}:4000/graphql`;
