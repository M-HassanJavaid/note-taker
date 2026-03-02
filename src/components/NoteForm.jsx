import React, { useState, useRef, useEffect, useContext } from 'react';
import { ImagePlus, X, Save, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import cn from '../utils/cn';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from './Loader';
import NoteContext from '../context/noteContext';

const NoteForm = () => {
    const [searchParams] = useSearchParams();
    let editId = searchParams.get('edit');

    const [isLoading, setIsLoading] = useState(editId ? true : false)
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const { setNotes } = useContext(NoteContext)


    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }));
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, image: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (title.length > 100) newErrors.title = "Title too long (max 100 chars)";
        if (!note.trim()) newErrors.note = "Note content cannot be empty";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createNote = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', note);
            if (image) formData.append('image', image);

            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/note/create`, {
                credentials: 'include',
                method: 'POST',
                body: formData
            });

            let data = await res.json();

            if (!data.success) {
                alert(data.message);
                return
            }

            alert("Note saved successfully!");
            navigate('/')
        } catch (err) {
            alert("Failed to save note");
        } finally {
            setIsSaving(false);
        }
    };

    const getNote = async () => {
        try {
            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/note/id/${editId}`, {
                credentials: 'include'
            });
            let { success, message, note } = await res.json();
            if (!success) throw new Error(message);
            setPreview(note.image.url);
            setTitle(note.title);
            setNote(note.text);
        } catch (error) {
            navigate('/')
            alert(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const updateNote = async (e) => {
        try {
            e.preventDefault();
            if (!validate()) return;

            setIsSaving(true);

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', note);
            if (image) formData.append('image', image);

            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/note/update/${editId}`, {
                credentials: 'include',
                method: 'PUT',
                body: formData
            });

            let data = await res.json();

            if (!data.success) throw new Error(data.message);

            navigate('/')
            alert('Note updated successfully');
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        if (!editId) return;
        getNote()
    }, [])


    if (isSaving || isLoading) {
        return <Loader />
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-(--bg-primary) p-6">
            <form
                onSubmit={editId ? updateNote : createNote}
                className="w-full max-w-2xl bg-(--bg-secondary) rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden"
            >
                {/* Image Upload Area - Fixed to 1:1 Aspect Ratio */}
                <div className="flex justify-center bg-slate-900/20 border-b border-slate-800/50">
                    <div
                        onClick={() => !preview && fileInputRef.current.click()}
                        className={cn(
                            "relative aspect-square w-full max-w-[300px] flex flex-col items-center justify-center cursor-pointer transition-all",
                            !preview && "hover:bg-slate-900/50 border-x border-slate-800/30"
                        )}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg p-2" />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                                    className="absolute top-4 right-4 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors shadow-lg"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-(--text-secondary) animate-in fade-in zoom-in duration-300">
                                <div className="p-4 rounded-full bg-(--bg-primary) mb-3 border border-slate-800">
                                    <ImagePlus size={32} className="text-(--accent) opacity-80" />
                                </div>
                                <p className="text-sm font-semibold text-(--text-primary)">Add Cover Image</p>
                                <p className="text-xs opacity-50 mt-1">Square ratio works best</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-(--text-secondary) ml-1">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's on your mind?"
                            className={cn(
                                "bg-slate-900/40 border-slate-800 focus:border-(--accent)",
                                errors.title && "border-red-500/50 focus:border-red-500"
                            )}
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
                    </div>

                    {/* Note Content */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-(--text-secondary) ml-1">Content</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Write your secret note here..."
                            className={cn(
                                "w-full min-h-[180px] p-4 rounded-lg outline-none transition-all resize-none",
                                "bg-slate-900/40 text-(--text-primary) border border-slate-800 focus:border-(--accent)",
                                errors.note && "border-red-500/50"
                            )}
                        />
                        {errors.note && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.note}</p>}
                    </div>

                    {/* Submit Section */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/50">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-(--text-secondary) hover:text-(--text-primary) transition-colors text-sm font-semibold px-4"
                        >
                            Discard
                        </button>
                        <Button
                            type="submit"
                            loading={isSaving}
                            className="px-10 py-6 rounded-xl shadow-xl shadow-blue-500/10 font-bold"
                        >
                            <Save size={18} className="mr-2" />
                            {editId ? "Update Note" : "Save Note"}
                        </Button>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default NoteForm;