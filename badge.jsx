
import React from 'react'
export const Badge = ({className='', children, variant='secondary'}) => {
  const styles = variant==='secondary' ? 'bg-zinc-800 text-zinc-200' : 'bg-lime-500 text-black'
  return <span className={`px-2 py-1 rounded-full text-xs ${styles} ${className}`}>{children}</span>
}
