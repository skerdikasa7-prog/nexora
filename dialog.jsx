
import React from 'react'
export const Dialog = ({open, onOpenChange, children}) => open ? <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">{children}</div> : null
export const DialogTrigger = ({asChild, children}) => children
export const DialogContent = ({children}) => <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-4">{children}</div>
export const DialogHeader = ({children}) => <div className="mb-2">{children}</div>
export const DialogTitle = ({children}) => <div className="text-lg font-semibold">{children}</div>
export const DialogDescription = ({children}) => <div className="text-sm text-zinc-400">{children}</div>
