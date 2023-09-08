import type { Database } from '../../database.types'
import { format } from 'date-fns'

type Note = Database['public']['Tables']['notes']['Row']

async function fetchNote() {
  // await new Promise((resolve) => setTimeout(resolve, 2000))
  const res = await fetch(`${process.env.url}/rest/v1/notes?select=*`, {
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
    // cache: 'no-store',
    next: { revalidate: 10 },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data in server')
  }
  const notes: Note[] = await res.json()
  return notes
}

export default async function NotesList() {
  const notes = await fetchNote()
  return (
    <div>
      <p className="my-4 pb-3 text-xl font-medium underline underline-offset-4">
        Notes
      </p>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <p className="text-lg font-medium">{note.title}</p>
            <p className="text-sm text-gray-500">
              <strong>Created at:</strong>
              {note && format(new Date(note.created_at), 'yyyy-MM-dd HH:mm:ss')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
