import React from 'react'

interface FilterLayoutProps {
  children: React.ReactNode // Сюда Next.js автоматически положит контент из [[...tag]]/page.tsx (список заметок)
  sidebar: React.ReactNode // Сюда Next.js автоматически положит ваш SidebarNotes из @sidebar
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      {/* 1. Рендерим ваш параллельный маршрут сайдбара слева */}
      <aside
        style={{
          width: '250px',
          flexShrink: 0,
          backgroundColor: '#2c2c2c',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        {sidebar}
      </aside>

      {/* 2. Рендерим основной контент со списком заметок справа */}
      <main style={{ flexGrow: 1 }}>{children}</main>
    </div>
  )
}
