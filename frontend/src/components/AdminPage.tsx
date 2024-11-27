import { useState } from "react";
import { Community, isError, User } from "../schema";
import { addAdmin } from "../remote";
import { useAuth } from "./auth";
import { useRevalidator } from "react-router-dom";

interface AdminPageProps {
    admins: User["username"][];
    returnHandler: () => void;
    community_id: Community["id"];
}

const AdminPage = ({ community_id, admins, returnHandler }: AdminPageProps) => {
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [modDescription, setModDescription] = useState("");
    const [targetModName, setTargetModName] = useState("");

    const auth = useAuth();
    const validator = useRevalidator();

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (auth) {
            const resp = await addAdmin(auth.token, community_id, username);
            if (!isError(resp)) {
                validator.revalidate();
            } else {
                console.error("server error:", resp);
            }
        }
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (auth) {
            const resp = await addAdmin(auth.token, community_id, username);
            if (!isError(resp)) {
                validator.revalidate();
            } else {
                console.error("server error:", resp);
            }
        }
    };

    const setModify = (e: React.MouseEvent, username: string) => {
        e.preventDefault();
        setTargetModName(username);
    };

    return (
        <div className="flex-1 h-screen w-full bg-[#342c33] flex flex-col items-start gap-4 p-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center w-full">
                <h1 className="text-white text-2xl font-semibold">Admin Management</h1>
                <button 
                    className="text-white bg-[#e78fcb] px-4 py-2 rounded-lg hover:bg-[#d07db0]" 
                    onClick={returnHandler}
                >
                    Exit
                </button>
            </div>

            {/* Admin List */}
            <div className="w-full">
                <h2 className="text-white text-xl font-bold mb-3">Current Admins</h2>
                {admins.map((admin) => (
                    <div
                        key={admin}
                        className="flex justify-between items-center bg-[#514350] text-white px-4 py-2 mb-2 rounded-lg"
                    >
                        <span>{admin}</span>
                        <div className="flex gap-2">
                            <button
                                className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-400"
                                onClick={handleRemove}
                            >
                                Remove
                            </button>
                            <button
                                className="text-white bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-400"
                                onClick={(e) => setModify(e, admin)}
                            >
                                Modify
                            </button>
                        </div>
                        {targetModName === admin && (
                            <input
                                type="text"
                                placeholder="Update description"
                                value={modDescription}
                                onChange={(e) => setModDescription(e.target.value)}
                                className="mt-2 px-4 py-2 rounded-lg bg-[#514350] text-white focus:outline-none"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Add Admin */}
            <div className="w-full">
                <h2 className="text-white text-xl font-bold mb-3">Add Admin</h2>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#514350] text-white focus:outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#514350] text-white focus:outline-none"
                    />
                    <button
                        className="text-white bg-[#e78fcb] px-4 py-2 rounded-lg hover:bg-[#d07db0] focus:outline-none hover:outline-none"
                        onClick={handleAdd}
                    >
                        Add Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
