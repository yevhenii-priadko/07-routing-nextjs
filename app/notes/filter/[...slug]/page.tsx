import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'
import NotesClient from '../../Notes.client' // Перевірте, чи правильний шлях до вашого клієнтського компонента

interface NotesFilterPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function NotesFilterPage({ params }: NotesFilterPageProps) {
  // Розгортаємо асинхронні параметри (особливість Next.js 15)
  const resolvedParams = await params

  // params.tag — це масив через catch-all [[...tag]]. Беремо перший елемент безпечно.
  const tagFromUrl = resolvedParams.slug?.[0]

  // Якщо в URL написано 'all' або тег відсутній, передаємо undefined на бекенд (за ТЗ)
  const currentTag = tagFromUrl === 'all' ? undefined : tagFromUrl

  const queryClient = new QueryClient()

  // Попередньо завантажуємо дані на сервері, додаючи поточний тег у queryKey та queryFn
  await queryClient.prefetchQuery({
    // Додаємо тег у масив ключів, щоб React Query знав, що це дані під конкретний фільтр
    queryKey: ['notes', '', 1, currentTag],
    queryFn: () => fetchNotes('', 1, currentTag),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  )
}
