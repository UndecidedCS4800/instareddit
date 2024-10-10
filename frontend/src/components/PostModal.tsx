import React from "react";
import { CreatePost } from "./CreatePost";

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-stone-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Create Post</h2>
                <CreatePost />

                <button
                    onClick={onClose}
                    className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full mt-4 w-full"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default PostModal;