import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import NotePreviewClient from './NotePreview.client' // Локальний імпорт клієнтської модалки

interface NotePreviewPageProps {
  // Обов'язкова типізація пропса params як Promise відповідно до вимог Next.js 15/16 та бота
  params: Promise<{ id: string }>
}

export default async function NotePreviewModalPage({ params }: NotePreviewPageProps) {
  // Розгортаємо асинхронні параметри маршруту
  const resolvedParams = await params
  const id = resolvedParams.id

  const queryClient = new QueryClient()

  // Попередньо завантажуємо дані нотатки на сервері строго за ТЗ
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })

  return (
    // Передаємо кеш даних через HydrationBoundary клієнтському компоненту
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  )
}
