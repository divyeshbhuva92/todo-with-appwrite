import { Client, Account, Databases, Avatars } from "appwrite";

const client = new Client();

client.setEndpoint("http://localhost/v1").setProject("63f88b864b3b3590b755");

export const account = new Account(client);

const avatars = new Avatars(client);

export let userAvtarResult = avatars.getInitials();

// database
export const databases = new Databases(client, "63f88d27c0c0c0e90da0");
