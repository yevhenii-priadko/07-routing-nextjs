'use client'

import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'

import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'
import Modal from '@/components/Modal/Modal'
import NoteForm from '@/components/NoteForm/NoteForm'
import css from '../../notes.module.css'
import { fetchNotes } from '@/lib/api'

interface NotesClientProps {
  tag?: string // Значення тега (currentTag), передане з серверного компонента
}

export default function NotesClient({ tag }: NotesClientProps) {
  // Локальні стейти для керування параметрами пошуку та пагінації
  const [localSearch, setLocalSearch] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // ЗБЕРІГАЄМО ПОПЕРЕДНІЙ ТЕГ З ПРОПСІВ ДЛЯ СКИДАННЯ СТАНУ ПІД ЧАС РЕНДЕРУ
  const [prevTag, setPrevTag] = useState<string | undefined>(tag)

  // Якщо проп tag, який прийшов з сервера, змінився — синхронно скидаємо локальні стані
  if (tag !== prevTag) {
    setPrevTag(tag)
    setPage(1)
    setSearch('')
    setLocalSearch('')
  }

  // Хук React Query: тепер використовує проп tag прямо у queryKey та queryFn
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search, page, tag],
    queryFn: () => fetchNotes(search, page, tag),
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
