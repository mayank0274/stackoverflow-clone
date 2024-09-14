import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";
import env from "@/app/env";

let client = new Client();

client
  .setEndpoint(env.appWrite.endpoint) // Your API Endpoint
  .setProject(env.appWrite.projectId) // Your project ID
  .setKey(env.appWrite.apikey)
  .setSelfSigned(true);

const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, databases, avatars, storage, users };
