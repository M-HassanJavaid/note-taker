import React, { useContext, useEffect, useState } from 'react'
import cn from '../utils/cn';
import NoteCard from '../components/NoteCard'
import Loader from '../components/Loader';
import Header from '../components/headers';
import NoteContext from '../context/noteContext';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => { // Capitalized component name (React convention)

  const { notes, setNotes } = useContext(NoteContext)
  const [isLoading, setIsLoading] = useState(true);

  async function getNotes() {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/note/all`, {
        credentials: 'include'
      });
      let data = await res.json();

      if (!data.success) {
        alert(data.message)
        return;
      }
      setNotes(data.notes)
    } catch (error) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getNotes()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) flex flex-col items-center">
      {/* Header takes full width */}
      <div className="w-full">
        <Header />
      </div>

      <main className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {notes.length > 0 ? (
          <div className={cn(
            "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6"
          )}>
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                content={note.text}
                image={note?.image?.url}
                date={note.createdAt}
                id={note._id}
              />
            ))}
          </div>
        ) : (
          /* Empty State UI */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="p-6 rounded-full bg-slate-900/50 border border-slate-800 mb-6">
               <PlusCircle size={48} className="text-(--accent) opacity-40" />
            </div>
            <h2 className="text-2xl font-bold text-(--text-primary) mb-2">No notes found</h2>
            <p className="text-(--text-secondary) max-w-xs mb-8 leading-relaxed">
              Your secret vault is empty. Start by creating your first encrypted note.
            </p>
            <Link 
              to="/create-note" 
              className="px-6 py-3 bg-(--accent) text-(--bg-primary) rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Create First Note
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard