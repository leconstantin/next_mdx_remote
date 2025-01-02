import { Metadata } from "next";
import React from "react";
import { promises as fs } from "fs";
import path from "path";
import { MDXRemote, compileMDX } from "next-mdx-remote/rsc";
import Button from "@/components/Button";
import Link from "next/link";

type blogData = {
  title: string;
  description: string;
};
type ProjectProps = {
  params: {
    projectSlug: string;
  };
};

export async function generateMetadata({ params }: ProjectProps) {
  const slug = params.projectSlug;
  const content = await fs.readFile(
    path.join(process.cwd(), "src/content/blog", `${slug}.mdx`),
    "utf-8"
  );
  // console.log(content);
  const { frontmatter } = await compileMDX<blogData>({
    source: content,
    options: {
      parseFrontmatter: true,
    },
  });
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
}

export default async function Project({ params }: ProjectProps) {
  const slug = params.projectSlug;
  const content = await fs.readFile(
    path.join(process.cwd(), "src/content/blog", `${slug}.mdx`),
    "utf-8"
  );
  // console.log(content);
  const data = await compileMDX<blogData>({
    source: content,
    options: {
      parseFrontmatter: true,
    },
    components: {
      Button,
    },
  });
  // console.log(data);

  return (
    <>
      <article className="prose lg:prose-xl max-w-3xl mx-auto">
        {/* <MDXRemote
          source={content}
          components={{
            Button,
          }}
        /> */}
        <Link href="/projects">All blog posts</Link>
        <h1>{data.frontmatter.title}</h1>
        {data.content}
      </article>
    </>
  );
}
