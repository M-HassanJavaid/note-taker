import React, { useState, useRef } from 'react';
import { ImagePlus, X, Save, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import cn from '../utils/cn';

const NoteForm = () => {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', note);
            if (image) formData.append('image', image);

            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/note/login`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json", // ✅ REQUIRED
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });


            alert("Note saved successfully!");
        } catch (err) {
            alert("Failed to save note");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-(--bg-primary) p-6">
            <form 
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-(--bg-secondary) rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden"
            >
                {/* Image Upload Area */}
                <div 
                    onClick={() => !preview && fileInputRef.current.click()}
                    className={cn(
                        "relative h-48 w-full border-b border-slate-800/50 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/30",
                        !preview && "hover:bg-slate-900/50"
                    )}
                >
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                                className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-(--text-secondary)">
                            <ImagePlus size={40} className="mb-2 opacity-50" />
                            <p className="text-sm font-medium">Add a cover image</p>
                            <p className="text-xs opacity-50">PNG, JPG up to 5MB</p>
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

                <div className="p-8 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-(--text-secondary) ml-1">Title</label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title..."
                            className={cn(errors.title && "border-red-500/50 focus:border-red-500")}
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.title}</p>}
                    </div>

                    {/* Note Content */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-(--text-secondary) ml-1">Your Note</label>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Start writing..."
                            className={cn(
                                "w-full min-h-[200px] p-4 rounded-lg outline-none transition-all resize-none",
                                "bg-slate-900/50 text-(--text-primary) border border-transparent focus:border-(--accent)",
                                errors.note && "border-red-500/50"
                            )}
                        />
                        {errors.note && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.note}</p>}
                    </div>

                    {/* Submit Section */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/50">
                        <button 
                            type="button"
                            className="text-(--text-secondary) hover:text-(--text-primary) transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <Button 
                            type="submit" 
                            loading={isSaving}
                            className="px-8 shadow-lg shadow-blue-500/10"
                        >
                            <Save size={18} className="mr-2" />
                            Save Note
                        </Button>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default NoteForm;