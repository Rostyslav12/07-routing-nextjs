
import { notFound } from "next/navigation";

import { fetchNoteById } from "../../../lib/api";
import NoteDetails from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return <NoteDetails note={note} />;
  } catch {
    notFound();
  }
}
