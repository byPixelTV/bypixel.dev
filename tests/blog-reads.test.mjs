import { beforeEach, describe, expect, mock, test } from "bun:test";
import { ObjectId } from "mongodb";

const authorId = new ObjectId().toString();
const fixtures = [
  {
    _id: new ObjectId(),
    userId: authorId,
    slug: "first",
    title: "First",
    content: "LARGE ARTICLE BODY",
    draft: false,
  },
  {
    _id: new ObjectId(),
    userId: authorId,
    slug: "second",
    title: "Second",
    content: "ANOTHER ARTICLE BODY",
    draft: false,
  },
  {
    _id: new ObjectId(),
    userId: authorId,
    slug: "private",
    title: "Private draft",
    content: "PRIVATE BODY",
    draft: true,
  },
];
let admin = false;
let authorQueries = 0;
let listOptions;

mock.module("server-only", () => ({}));
mock.module("@/lib/session", () => ({
  isServerAdmin: async () => admin,
  isAdminFromHeaders: async () => admin,
}));
mock.module("@/lib/mongo", () => ({
  getPostsCollection: async () => ({
    find: (filter, options) => {
      listOptions = options;
      return {
        sort: () => ({
          toArray: async () =>
            fixtures
              .filter((post) => filter.draft === undefined || post.draft === filter.draft)
              .map((post) => {
                const result = { ...post };
                if (options?.projection?.content === 0) delete result.content;
                return result;
              }),
        }),
      };
    },
    findOne: async (filter) =>
      fixtures.find(
        (post) =>
          post.slug === filter.slug && (filter.draft === undefined || post.draft === filter.draft),
      ) ?? null,
  }),
  db: {
    collection: () => ({
      find: (filter) => {
        authorQueries++;
        expect(filter._id.$in).toHaveLength(1);
        return { toArray: async () => [{ _id: new ObjectId(authorId), name: "Pixel" }] };
      },
    }),
  },
}));

const { GET } = await import("../src/app/api/posts/route.ts");
const { getPostBySlug } = await import("../src/lib/actions/blog.ts");

beforeEach(() => {
  admin = false;
  authorQueries = 0;
  listOptions = undefined;
});

describe("Blog read performance and privacy", () => {
  test("public summaries exclude draft posts and full content, and batch authors", async () => {
    const response = await GET(new Request("http://localhost/api/posts"));
    const { posts } = await response.json();
    expect(response.status).toBe(200);
    expect(posts).toHaveLength(2);
    expect(posts.every((post) => !post.draft && !("content" in post))).toBe(true);
    expect(posts.every((post) => post.authorName === "Pixel")).toBe(true);
    expect(listOptions.projection).toEqual({ content: 0 });
    expect(authorQueries).toBe(1);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  test("authenticated admin keeps draft summaries without caching them publicly", async () => {
    admin = true;
    const response = await GET(new Request("http://localhost/api/posts"));
    const { posts } = await response.json();
    expect(posts).toHaveLength(3);
    expect(posts.some((post) => post.draft)).toBe(true);
    expect(posts.every((post) => !("content" in post))).toBe(true);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  test("requesting draft previews does not grant a visitor draft access", async () => {
    expect((await getPostBySlug("private", { includeDraftsForAdmin: true })).post).toBeNull();
    expect((await getPostBySlug("first", { includeDraftsForAdmin: true })).post?.slug).toBe(
      "first",
    );
  });
  test("admins can preview drafts only when explicitly requested", async () => {
    admin = true;
    expect((await getPostBySlug("private")).post).toBeNull();
    expect((await getPostBySlug("private", { includeDraftsForAdmin: true })).post?.draft).toBe(
      true,
    );
  });
});
