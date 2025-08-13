import { NextResponse } from "next/server";
import {
    getAllPosts,
    searchPosts,
    getPostsByType,
    getFirstPost,
    getRandomPost,
} from "../../_lib/utils/posts";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const query = searchParams.get("query");
    const type = searchParams.get("type");

    try {
        switch (action) {
            case "all":
                return NextResponse.json(getAllPosts());

            case "search":
                if (!query) {
                    return NextResponse.json(
                        { error: "Query parameter required for search" },
                        { status: 400 },
                    );
                }
                return NextResponse.json(searchPosts(query));

            case "by-type":
                if (!type) {
                    return NextResponse.json({ error: "Type parameter required" }, { status: 400 });
                }
                return NextResponse.json(
                    getPostsByType(
                        type as
                            | "land-development"
                            | "software-development"
                            | "build-things"
                            | "rant",
                    ),
                );

            case "first":
                const firstPost = getFirstPost();
                return NextResponse.json(firstPost);

            case "random":
                const randomPost = getRandomPost();
                return NextResponse.json(randomPost);

            default:
                return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in posts API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
