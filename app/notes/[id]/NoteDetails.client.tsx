'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import css from './NoteDetails.module.css'

export default function NoteDetailsClient() {
  const params = useParams()
  const id = params?.id as string

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  })

  // 1. Обробка стану завантаження строго за ТЗ
  if (isLoading) {
    return <p>Loading, please wait...</p>
  }

  // 2. Обробка помилки або відсутності нотатки строго за ТЗ
  if (isError || !note) {
    return <p>Something went wrong.</p>
  }

  // 3. Розмітка знайденої нотки строго за ТЗ
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleDateString('uk-UA')}</p>
      </div>
    </div>
  )
}
