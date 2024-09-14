import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("db connected");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("db created");
      await Promise.all([
        createAnswerCollection(),
        createCommentCollection(),
        createQuestionCollection(),
        createVoteCollection(),
      ]);

      console.log("collection created");
      console.log("db connected");
    } catch (error: any) {
      console.log(`creating db : `, error.message);
    }
  }

  return databases;
}
