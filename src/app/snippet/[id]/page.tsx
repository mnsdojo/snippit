"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function Page({ params }: { params: { id: string } }) {
  const snippet = useQuery(api.snippit.getSnippet, { slug: params.id });
  if (!snippet) return <div>Wait ...</div>;

  return (
    <div>
      <h1>{snippet.title}</h1>
      <p>Created at: {new Date(snippet.createdAt).toLocaleString()}</p>
      <p>Language: {snippet.language}</p>
      <p>Font Style: {snippet.fontStyle}</p>
      <p>Font Size: {snippet.fontSize}</p>
      <p>Exposure: {snippet.exposure}</p>
      <p>View Count: {snippet.viewCount}</p>
      <pre>
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

export default Page;
