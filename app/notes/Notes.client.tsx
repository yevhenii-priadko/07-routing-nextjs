'use client'

import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { useParams } from 'next/navigation'

import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'
import Modal from '@/components/Modal/Modal'
import NoteForm from '@/components/NoteForm/NoteForm'
import css from './notes.module.css'
import { fetchNotes } from '@/lib/api'

export default function NotesClient() {
  const params = useParams()

  const tagFromUrl = Array.isArray(params?.tag) ? params.tag[0] : params?.tag
  const currentTag = tagFromUrl === 'all' ? undefined : tagFromUrl

  // Локальні стейти
  const [localSearch, setLocalSearch] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // ЗБЕРІГАЄМО ПОПЕРЕДНІЙ ТЕГ ДЛЯ СКИДАННЯ СТАНУ БЕЗ EFFECT
  const [prevTag, setPrevTag] = useState<string | undefined>(currentTag)

  // Якщо тег в URL змінився, ми синхронно оновлюємо стейти ПРЯМО ПІД ЧАС РЕНДЕРУ.
  // Це запобігає каскадним рендерам і повністю прибирає помилку!
  if (currentTag !== prevTag) {
    setPrevTag(currentTag)
    setPage(1)
    setSearch('')
    setLocalSearch('')
  }

  // Хук React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search, page, currentTag],
    queryFn: () => fetchNotes(search, page, currentTag),
    placeholderData: keepPreviousData,
  })

  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearch(text)
    setPage(1)
  }, 500)

  const handleSearchChange = (text: string) => {
    setLocalSearch(text)
    debouncedSearch(text)
  }

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} value={localSearch} />

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={p => setPage(p)} />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <div className={css.loading}>Loading notes...</div>}
      {isError && <div className={css.error}>Something went wrong!</div>}

      {!isLoading && !isError && <NoteList notes={notes} />}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}
