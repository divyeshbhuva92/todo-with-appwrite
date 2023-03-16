import { Client, Account, Databases, Avatars } from "appwrite";

const client = new Client();

client.setEndpoint("http://localhost/v1").setProject("6409d0541e9d76a18f05");

export const account = new Account(client);

export const avatars = new Avatars(client);

export let userAvtarResult = avatars.getInitials();

// database
export const databases = new Databases(client, "6409d0710846c3cefc3c");
