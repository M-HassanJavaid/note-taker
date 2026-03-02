import React, { useContext, useEffect, useState } from 'react'
import cn from '../utils/cn';
import NoteCard from '../components/NoteCard'
import Loader from '../components/Loader';
import Header from '../components/headers';
import NoteContext from '../context/noteContext';

const dashboard = () => {

  const { notes , setNotes } = useContext(NoteContext)
  const [isLoading, setIsLoading] = useState(true);

  

  async function getNotes() {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/note/all` , {
        credentials: 'include'
      });
      let data = await res.json();
      console.log(data)
  
      if (!data.success) {
        alert(data.message)
        return ;
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
    return <Loader/>
  }
  

  return (
    <div className="">
      <Header/>
      <div className={cn(
        "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 w-full mx-auto p-6"
      )}>
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            title={note.title}
            content={note.text}
            image={note?.image?.url} // Works if null or undefined
            date={note.createdAt}
            id={note._id}
          />
        ))}
      </div>
    </div>
  )
}

export default dashboard