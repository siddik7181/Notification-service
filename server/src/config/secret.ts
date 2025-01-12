import dotenv from "dotenv";
dotenv.config();


export const PORT = process.env.PORT || "8080"
export const RABBITMQURL = process.env.RABBITMQURL || "localhost";
export const SERVERHOST = process.env.SERVERHOST || "localhost";
export const PROVIDERHOST = process.env.PROVIDERHOST || "localhost";