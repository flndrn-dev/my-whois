import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO 8601 date string
  readingMinutes: number;
  tags: string[];
};

export type BlogPost = BlogPostMeta & {
  content: string; // raw MDX source
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

async function readPostFile(filename: string): Promise<BlogPost> {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = await fs.readFile(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishedAt: String(data.publishedAt ?? new Date().toISOString()),
    readingMinutes:
      typeof data.readingMinutes === "number"
        ? data.readingMinutes
        : estimateReadingMinutes(content),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content,
  };
}

let cache: BlogPost[] | null = null;

export async function getAllPosts(): Promise<BlogPost[]> {
  if (cache) return cache;
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts = await Promise.all(files.map(readPostFile));
  posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  cache = posts;
  return posts;
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
