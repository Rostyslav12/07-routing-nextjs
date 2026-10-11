
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { fetchNotes } from "../../../../lib/api";
import NotesClient from "./Notes.client";

const allowedTags = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  if (slug.length !== 1) {
    notFound();
  }

  const requestedTag = slug[0];

  if (!requestedTag) {
    notFound();
  }

  const tag =
    requestedTag.toLowerCase() === "all"
      ? "all"
      : allowedTags.find(
          (item) => item.toLowerCase() === requestedTag.toLowerCase(),
        );

  if (!tag) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, search: "", tag }],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
