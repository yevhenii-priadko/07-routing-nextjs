import axios from 'axios'
import type { Note, NoteInput } from '../types/note'

interface ResponseNotes {
  notes: Note[]
  totalPages: number
}

const BASE_URL = 'https://notehub-public.goit.study/api/notes'

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${myKey}`,
}

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string
): Promise<ResponseNotes> {
  const params: { search: string; page: number; perPage: number; tag?: string } = {
    search,
    page,
    perPage: 10,
  }

  if (tag && tag !== 'all') {
    params.tag = tag
  }
  const response = await axios.get<ResponseNotes>(BASE_URL, {
    params,
    headers,
  })

  return response.data
}

export async function createNote(noteData: NoteInput): Promise<Note> {
  const response = await axios.post<Note>(BASE_URL, noteData, { headers })
  return response.data
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, { headers })
  return response.data
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, { headers })
  return response.data
}
