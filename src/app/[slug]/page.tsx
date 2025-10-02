import Link from "next/link";
import { client } from "@/sanity/client";
import { PortableText, type SanityDocument } from "next-sanity";

export const revalidate = 30;

const POST_QUERY = `*[_type=="post" && slug.current==$slug][0]{
  title,
  publishedAt,
  content,   // Portable Text
  contentMd  // Markdown text (chỉ hiển thị như plain text)
}`;

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, {
    slug: params.slug,
  });

  if (!post) {
    return (
      <main className="container mx-auto max-w-3xl p-8">
        <Link href="/" className="hover:underline">
          ← Back to posts
        </Link>
        <p className="mt-6">Post not found.</p>
      </main>
    );
  }

  const published = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : "—";

  return (
    <main className="container mx-auto max-w-3xl p-8 space-y-4">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500">Published: {published}</p>

      {Array.isArray(post.content) && (
        <article className="prose">
          <PortableText value={post.content} />
        </article>
      )}
    </main>
  );
}
