import { useState, FormEvent } from "react";
import { useAuth } from "./auth";
import { isError, JWTTokenResponse, PostRequest, ServerError } from "../schema";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPost } from "../remote";

export const CreatePost = () => {
    const [text, setText] = useState("");
    const [srvError, setError] = useState<ServerError | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();
    const { communityid } = useParams(); // Get community ID if available

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        if (!auth) {
            return;
        }
    
        const a = auth as JWTTokenResponse;
    
        // Prepare post object, omitting community if not provided
        const post: PostRequest = {
            text,
            ...(communityid ? { community: Number(communityid) } : {}) // Include community only if provided
        };
    
        // Call createPost and log the response
        const res = await createPost(a.token, post);
        
        // Log the response to inspect the result
        console.log('Created post response:', res);
    
        if (isError(res)) {
            setError(res);
        } else {
            // Check the post ID and log it if valid
            if (res && res.id) {
                console.log('Created post ID:', res.id);
    
                // If communityid exists, navigate to community post page
                if (communityid) {
                    navigate(`/community/${communityid}/posts/${res.id}`, { replace: true });
                } else {
                    // For user posts, navigate to the user post page
                    navigate(`/user/${auth?.username}/posts/${res.id}`, { replace: true });
                }
            } else {
                console.error('Invalid response: No post ID found.');
            }
        }
    };
    

    if (!auth) {
        return <div>Need to be logged in</div>;
    }

    return (
        <>
            {srvError && <p className="text-red-500">Error: {srvError.error}</p>}

            {/* Modal */}
            <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#342c33] rounded-lg p-8 w-full max-w-lg border-2 border-[#514350] relative">
                    <Link
                        className="absolute top-2 right-4 text-white hover:text-[#e78fcb]"
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
                            className="w-full bg-[#514350] focus:outline-none border border-[#514350] rounded-md p-2 mb-4"
                            required
                        />
                        <button
                            type="submit"
                            className="h-10 py-2.5 bg-[#e78fcb] rounded-[30px] justify-center items-center gap-2.5 inline-flex focus:outline-none hover:bg-[#d07db0]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};