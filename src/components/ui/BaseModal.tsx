type Props={
    isOpen: boolean
    onClose: ()=>void
    children: React.ReactNode
    title?:string
}

export default function BaseModal({isOpen,onClose,children,title}:Props){
    if(!isOpen)
        return null

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop mờ phía sau */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}  // ← bấm ra ngoài để đóng
      />

      {/* Hộp modal */}
      <div className="relative z-10 bg-white rounded-xl p-6 w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Nội dung do bên ngoài truyền vào */}
        {children}
      </div>
    </div>
  )
}