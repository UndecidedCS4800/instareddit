import { useState, FormEvent } from "react"
import { useAuth } from "./auth"
import { isError, JWTTokenResponse, PostRequest, ServerError } from "../schema"
import { Link, useNavigate, useParams } from "react-router-dom"
import { createPost } from "../remote"

export const CreatePost = () => {
    const [text, setText] = useState("")
    const [srvError, setError] = useState<ServerError | null>(null)
    // const [isOpen, setIsOpen] = useState(true) // Modal state
    const auth = useAuth()
    const navigate = useNavigate()
    const { communityid } = useParams()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const a = auth as JWTTokenResponse
        const post: PostRequest = {
            text,
            community: Number(communityid)
        }
        const res = await createPost(a.token, post)
        if (isError(res)) {
            setError(res)
        } else {
            navigate(`../posts/${res.id}`, { replace: true })
        }
    }


    if (!auth) {
        return <div>Need to be logged in</div>
    }

    return (
        <>
            {srvError && <p className="text-red-500">Error: {srvError.error}</p>}

            {/* Button to open modal */}
           

            {/* Modal */}
            
                <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg relative">
                        <Link
                            className="absolute top-2 right-4 text-gray-400 hover:text-gray-600"
                            to=".."
                        
                        >
                            Close
                        </Link>
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-xl font-semibold mb-4">Create Post</h1>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Write your post..."
                                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            
        </>
    )
}
