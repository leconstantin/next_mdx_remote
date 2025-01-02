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

export async function generateMetadata({
  params,
}: ProjectProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const slug = projectSlug;
  const content = await fs.readFile(
    path.join(process.cwd(), "src/content/blog", `${slug}.mdx`),
    "utf-8"
  );
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

// const components = {
//   h1: ({ className, ...props }) => (
//     <h1
//       className={cn(
//         "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
//         className
//       )}
//       {...props}
//     />
//   ),
//   h2: ({ className, ...props }) => (
//     <h2
//       className={cn(
//         "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
//         className
//       )}
//       {...props}
//     />
//   ),}
export default async function Project({ params }: ProjectProps) {
  const { projectSlug } = await params;
  const slug = projectSlug;
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
      <article className="prose lg:prose-xl max-w-3xl mx-auto prose-h1:mt-2 prose-h1:text-blue-500 prose-h1:scroll-m-20 prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-p:leading-7 prose-p:[&:not(:first-child)]:mt-6 prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-500">
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
