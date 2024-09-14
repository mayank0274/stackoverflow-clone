import { NextRequest, NextResponse } from "next/server";
import { databases, users } from "@/models/server/config";
import { db, answerCollection } from "@/models/name";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/auth";

export async function POST(req: NextRequest) {
  try {
    const { questionId, answer, authorId } = await req.json();
    const res = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        questionId,
        content: answer,
        authorId,
      }
    );

    // increase user repuation
    const userPrefs = await users.getPrefs<UserPrefs>(authorId);
    await users.updatePrefs(authorId, {
      reputation: Number(userPrefs.reputation) + 1,
    });

    return NextResponse.json({ success: true, res }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error in creating answer" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { answerId } = await req.json();
    const answer = await databases.getDocument(db, answerCollection, answerId);

    if (answer) {
      await databases.deleteDocument(db, answerCollection, answerId);
      const userPrefs = await users.getPrefs<UserPrefs>(answer.authorId);
      await users.updatePrefs(answer.authorId, {
        reputation: Number(userPrefs.reputation) - 1,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error in deleting answer" },
      { status: 500 }
    );
  }
}
