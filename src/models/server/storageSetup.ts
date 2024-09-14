import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("storage connected");
  } catch (error) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.delete("users"),
          Permission.update("users"),
          Permission.create("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "jpeg", "png"]
      );
    } catch (error: any) {
      console.log("`creating storage bucket : ", error.message);
    }
  }
}
