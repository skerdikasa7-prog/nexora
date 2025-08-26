
import React from 'react'
export const Tabs = ({value, onValueChange, children}) => <div>{children}</div>
export const TabsList = ({className='', children}) => <div className={`rounded-xl bg-zinc-800 p-1 ${className}`}>{children}</div>
export const TabsTrigger = ({value, className='', children, onClick}) => <button className={`px-3 py-2 text-sm rounded-xl hover:bg-zinc-700 ${className}`} onClick={onClick}>{children}</button>
export const TabsContent = ({value, className='', children}) => <div className={className}>{children}</div>
