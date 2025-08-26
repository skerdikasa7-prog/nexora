
import React, {useState} from 'react'
export const DropdownMenu = ({children}) => <div className="relative">{children}</div>
export const DropdownMenuTrigger = ({asChild, children}) => children
export const DropdownMenuContent = ({children}) => <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl p-1">{children}</div>
export const DropdownMenuItem = ({children, onClick, className=''}) => <button onClick={onClick} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 ${className}`}>{children}</button>
