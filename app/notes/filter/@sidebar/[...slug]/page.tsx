import type { NoteTag } from '@/types/note'
import css from './Sidebar.module.css' // Перевірте, чи імпортуються стилі без помилок
import Link from 'next/link'

const AVAILABLE_TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

interface SidebarNotesProps {
  params: Promise<{ slug?: string[] }>
}

export default async function SidebarNotes({ params }: SidebarNotesProps) {
  await params
  return (
    <ul className={css.menuList}>
      {/* Список усіх нотаток (завжди веде на /notes/filter/all) */}
      <li className={css.menuItem}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>

      {/* Динамічний перелік решти тегів за шаблоном з ТЗ */}
      {AVAILABLE_TAGS.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  )
}
