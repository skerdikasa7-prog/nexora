
import React from 'react'
export const Card = ({className='', children}) => <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 ${className}`}>{children}</div>
export const CardHeader = ({className='', children}) => <div className={`p-4 border-b border-zinc-800 ${className}`}>{children}</div>
export const CardContent = ({className='', children}) => <div className={`p-4 ${className}`}>{children}</div>
export const CardFooter = ({className='', children}) => <div className={`p-4 pt-0 ${className}`}>{children}</div>
