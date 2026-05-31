import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api' // Той самий шлях до сервісу запитів, що й вище
import NotesClient from './Notes.client'

export default async function NotesPage() {
  const queryClient = new QueryClient()

  // Попередньо завантажуємо дефолтні дані (пуста сторінка пошуку 1) на сервері
  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1],
    queryFn: () => fetchNotes('', 1),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  )
}
