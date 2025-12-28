import { Button } from '../components/ui/Button'
import { PlusIcon } from '../components/icons/PlusIcon'
import { ShareIcon } from '../components/icons/ShareIcon'
import { Card } from '../components/ui/Card'
import { AddContentModal } from '../components/ui/AddContentModal'
import { useEffect, useState } from 'react'
import { Sidebar } from '../components/ui/Sidebar'
import { useContentStore } from '../store/contentStore'
import { toast } from '../components/ui/Toast'
import { HamburgerIcon } from '../components/icons/HamburgerIcon'

export const Dashboard = () => {
  const [modalOpen, setModalOpen] =  useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const contents = useContentStore((state) => state.contents);
  const filter = useContentStore((state) => state.filter);
  const refresh = useContentStore((state) => state.refresh);
  const shareBrain = useContentStore((state) => state.shareBrain);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleShare = async () => {
    const hash = await shareBrain();
    if(hash){
      const shareUrl = `${window.location.origin}/brain/share/${hash}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share URL copied to clipboard!");
    }
    else{
      toast.error("Failed to generate share URL. Please try again.");
    }
  }

  const filteredContents = filter === "all" ? contents : contents.filter(content => content.type === filter);

  return (
    <>
      <AddContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="animated-gradient min-h-screen w-full p-8 pl-4 md:pl-84 transition-all duration-300">
        <div className="flex flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="md:hidden text-white cursor-pointer hover:bg-white/10 p-1 rounded" onClick={() => setSidebarOpen(true)}>
              <HamburgerIcon size="md" />
            </div>
            <h1 className="text-2xl font-bold text-white">All Notes</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="md" label="Add Content" startIcon={<PlusIcon size="md" />} onClick={() => setModalOpen(true)} />
            <Button onClick={handleShare} variant="secondary" size="md" label="Share Brain" startIcon={<ShareIcon size="md" />} />
          </div>
        </div>
        <div className="columns-1 md:columns-3 gap-4 mt-6">
          {filteredContents.map(({_id, type, link, title, tags}) => (
            <Card key={_id} _id={_id} type={type} title={title} link={link} tags={tags} />
          ))}
        </div>
      </div>
    </>
  )
}