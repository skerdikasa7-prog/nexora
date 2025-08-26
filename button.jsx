
import React from 'react'
export const Button = ({className='', variant='default', size='', children, ...props}) => {
  const base = "inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm shadow transition"
  const variants = {
    default: "bg-lime-500 text-black hover:opacity-90",
    secondary: "bg-zinc-800 text-white",
    ghost: "bg-transparent hover:bg-zinc-800/40",
  }
  const sizes = { sm: "px-2 py-1 text-xs", icon: "p-2" }
  return <button className={[base, variants[variant]||variants.default, sizes[size]||'', className].join(' ')} {...props}>{children}</button>
}
export default Button
