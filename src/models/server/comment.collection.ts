import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.delete("users"),
    Permission.update("users"),
  ]);

  console.log("created : comment collection");

  await Promise.all([
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true
    ),
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["answer", "question"],
      true
    ),
    databases.createStringAttribute(
      db,
      commentCollection,
      "typeId",
      50,
      true,
      undefined,
      true
    ),
    //authorInfo:[userId,userName]
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorInfo",
      50,
      true
    ),
  ]);

  console.log("created : comment attributes");
}
