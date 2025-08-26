
import React from 'react'
export const Avatar = ({className='', children}) => <div className={`h-10 w-10 rounded-full overflow-hidden bg-zinc-800 ${className}`}>{children}</div>
export const AvatarImage = ({src, alt=''}) => <img src={src} alt={alt} className="h-full w-full object-cover" />
export const AvatarFallback = ({children}) => <div className="h-full w-full flex items-center justify-center text-sm">{children}</div>
