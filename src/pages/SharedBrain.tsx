import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Sidebar } from '../components/ui/Sidebar';
import { Card } from '../components/ui/Card';
import { HamburgerIcon } from '../components/icons/HamburgerIcon';

export const SharedBrain = () => {
    const { hash } = useParams();
    const [brain, setBrain] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function fetchSharedBrain() {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/brain/share/${hash}`);
                setBrain(response.data);
            } catch (error) {
                console.error("Failed to fetch shared brain", error);
            }
        }
        fetchSharedBrain();
    }, [hash]);

    if(!brain){
        return <div className="animated-gradient min-h-screen flex justify-center items-center">
            <h1 className="text-2xl font-bold text-white">Shared Brain Not Found</h1>
        </div>;
    }

    return (
        <>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="animated-gradient min-h-screen w-full p-8 pl-4 md:pl-84 transition-all duration-300">
                <div className="flex justify-between items-center">
                    <div className="md:hidden text-white cursor-pointer hover:bg-white/10 p-1 rounded" onClick={() => setSidebarOpen(true)}>
                        <HamburgerIcon size="md" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{brain.username ? `${brain.username}'s Brain` : 'Shared Brain'}</h1>
                </div>
                <div className="columns-1 md:columns-3 gap-4 mt-6">
                    {brain.contents.map(({_id, type, link, title, tags}: any) => (
                    <Card key={_id} _id={_id} type={type} title={title} link={link} tags={tags} readOnly={true} />
                    ))}
                </div>
            </div>
        </>
    )
}