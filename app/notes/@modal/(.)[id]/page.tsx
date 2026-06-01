'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchNoteById } from '@/lib/api'
import type { Note } from '@/types/note'
import Modal from '@/components/Modal/Modal'
import css from '@/app/notes/@modal/(.)[id]/NotePreviewModal.module.css'

export default function NotePreviewModal() {
  const router = useRouter()
  const params = useParams()

  // Безопасно вытаскиваем строку ID заметки
  const rawId = params?.id || (Array.isArray(params?.tag) ? params.tag : params?.tag)
  const id = typeof rawId === 'string' ? rawId : ''

  // Изначально данных нет, поэтому состояние равно null
  const [note, setNote] = useState<Note | null>(null)

  useEffect(() => {
    if (!id || id === 'all') return

    fetchNoteById(id)
      .then((data: Note) => {
        setNote(data)
      })
      .catch((err: unknown) => {
        console.error('Помилка завантаження нотатки:', err)
      })
  }, [id])

  const handleClose = () => {
    router.back()
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {}
      {!note ? (
        <p>Loading details...</p>
      ) : (
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
    </Modal>
  )
}
