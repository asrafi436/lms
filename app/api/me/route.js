import { auth } from "@/auth";
import { getUserByEmail } from "@/queries/users";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    const session = await auth();

    if (!session?.user) {
        return new NextResponse(JSON.stringify({ error: "You are not authenticated!" }), {
            status: 401,
        });
    }

    try {
        const user = await getUserByEmail(session.user.email);
        if (!user) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
