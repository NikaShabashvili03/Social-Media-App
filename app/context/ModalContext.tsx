import React from 'react'
import EditModal from '../components/modals/EditModal'
import { SafeUser } from '../types'
import NewPost from '../components/modals/NewPost'
import EditPostModal from '../components/modals/EditPostModal'


interface ModalContextProps {
  currentUser: SafeUser | null
}

export default function ModalContext({currentUser}: ModalContextProps) {
  return (
    <div>
      {currentUser && (
        <>
          <EditModal currentUser={currentUser}/>
          <NewPost/>
          <EditPostModal/>
        </>
      )}
    </div>
  )
}
