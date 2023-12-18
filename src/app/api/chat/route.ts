import { NextResponse, type NextRequest } from "next/server";
import * as api from "@/server/root";

// const getChatById = async ({
//     conversationId,
//   }: {
//     conversationId: string | undefined;
//   }) => {
// };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({}, { status: 400 });
  }

  const chat = await api.chat.getChatById({ conversationId });
  return NextResponse.json(chat, { status: 200 });
}
