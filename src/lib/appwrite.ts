import { Client, Account, Databases } from "appwrite";

export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('67aa409f001a6c76d5ad'); // Project ID

export const account = new Account(client);
export const databases = new Databases(client);