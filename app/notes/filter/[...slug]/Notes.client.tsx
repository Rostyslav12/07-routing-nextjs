
"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import { fetchNotes } from "../../../../lib/api";

import styles from "./Notes.module.css";

interface NotesClientProps {
  tag: string;
}

const PER_PAGE = 12;

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 400);

  useEffect(() => {
    setPage(1);
  }, [tag]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["notes", { page, search, tag }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  return (
    <section className={styles.container}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>
          {tag === "all" ? "All notes" : `${tag} notes`}
        </h1>

        <button
          className={styles.createButton}
          type="button"
          onClick={() => setIsFormOpen(true)}
        >
          Create note +
        </button>
      </div>

      <div className={styles.search}>
        <SearchBox
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>

      {isPending && <p>Loading notes...</p>}

      {isError && (
        <p role="alert">
          Failed to load notes: {error.message}
        </p>
      )}

      {data && (
        <>
          <NoteList notes={data.notes} />

          {data.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {isFormOpen && (
        <Modal onClose={() => setIsFormOpen(false)}>
          <NoteForm onClose={() => setIsFormOpen(false)} />
        </Modal>
      )}
    </section>
  );
}
