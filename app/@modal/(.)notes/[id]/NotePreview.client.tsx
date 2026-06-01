'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import type { Note } from '@/types/note'
import Modal from '@/components/Modal/Modal' // Перевірте шлях до вашої модалки
import css from './NotePreviewModal.module.css'

interface NotePreviewClientProps {
  id: string
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter()

  // Використовуємо хук useQuery, який автоматично візьме дані з серверного кешу
  const { data: note, isLoading } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  })

  const handleClose = () => {
    router.back() // Повертаємося на попередню сторінку фільтру
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading && <p>Loading details...</p>}

      {!isLoading && note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              {note.tag && <span className={css.tag}>{note.tag}</span>}
            </div>

            <p className={css.content}>{note.content}</p>

            {note.createdAt && (
              <div className={css.date}>
                {new Date(note.createdAt).toLocaleDateString('uk-UA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}

            <button type='button' className={css.backBtn} onClick={handleClose}>
              Back
            </button>
          </div>
        </div>
      )}

      {!isLoading && !note && <p>Note data could not be loaded.</p>}
    </Modal>
  )
}
