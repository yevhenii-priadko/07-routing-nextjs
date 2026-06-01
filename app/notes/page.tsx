import { redirect } from 'next/navigation'

export default function NotesPage() {
  // Автоматично перенаправляємо користувача на сторінку, де налаштований сайдбар
  redirect('/notes/filter/all')
}
