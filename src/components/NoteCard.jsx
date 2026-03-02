import React, { useContext, useState } from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import cn from '../utils/cn';
import NoteContext from '../context/noteContext';
import { Link } from 'react-router-dom';

const NoteCard = ({ title, content, image, date, id }) => {

    const { setNotes, notes } = useContext(NoteContext);

    const formatDate = (isoString) => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const [isDeleting, setIsDeleting] = useState(false);

    async function deleteNote(id) {
        try {
            let isConfirm = confirm("Are you really want to delete this note?");
            if (!isConfirm) return; 
            setIsDeleting(true);
            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/note/delete/${id}`, {
                credentials: 'include',
                method: 'DELETE',
            });
            let data = await res.json();
            if (!data.success) throw new Error(data.message);
            
            setNotes((notes) => notes.filter((note) => (note._id != id)))
            alert('Note has deleted successfully.');
        } catch (error) {
            alert(error.message);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className={cn(
            "break-inside-avoid mb-4 sm:mb-6 rounded-2xl overflow-hidden transition-all duration-300 group",
            "bg-(--bg-secondary) border border-slate-800/50 hover:border-(--accent)/40 hover:shadow-xl",
            isDeleting && "pointer-events-none opacity-50 scale-95"
        )}>
            {/* 1:1 Aspect Ratio Image */}
            {image && (
                <div className="relative overflow-hidden aspect-square border-b border-slate-800/30">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-110"
                    />
                    {/* Overlay visible only on hover for pointer devices */}
                    <div className="absolute inset-0 bg-gradient-to-t from-(--bg-secondary)/60 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}

            {/* Content Area */}
            <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="text-sm sm:text-base font-bold text-(--text-primary) leading-tight line-clamp-2 lg:group-hover:text-(--accent) transition-colors">
                        {title}
                    </h3>

                    {/* Action Icons: Always visible on mobile, hover-only on desktop */}
                    <div className="flex gap-2 shrink-0 transition-all duration-300 transform lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-1 lg:group-hover:translate-y-0">
                        <Link to={`/create-note?edit=${id}`}>
                            <button
                                className="p-2 rounded-lg bg-slate-800/80 lg:bg-slate-800/50 hover:bg-(--accent) text-(--text-secondary) hover:text-(--bg-primary) transition-all shadow-sm"
                                title="Edit Note"
                            >
                                <Pencil size={14} className="sm:w-[16px] sm:h-[16px]" />
                            </button>
                        </Link>
                        <button
                            onClick={() => deleteNote(id)}
                            className="p-2 rounded-lg bg-slate-800/80 lg:bg-slate-800/50 hover:bg-red-500 text-(--text-secondary) hover:text-white transition-all shadow-sm"
                            title="Delete Note"
                        >
                            <Trash2 size={14} className="sm:w-[16px] sm:h-[16px]" />
                        </button>
                    </div>
                </div>

                <p className="text-xs sm:text-sm text-(--text-secondary)/90 leading-relaxed line-clamp-4 sm:line-clamp-5 mb-4">
                    {content}
                </p>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/30">
                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-(--text-secondary)/60">
                        <Calendar size={12} className="text-(--accent)/80" />
                        {formatDate(date)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;