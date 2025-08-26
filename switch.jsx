
import React from 'react'
export const Switch = ({checked, onCheckedChange}) => (
  <label className="inline-flex items-center cursor-pointer">
    <input type="checkbox" className="hidden" checked={checked} onChange={e => onCheckedChange?.(e.target.checked)} />
    <span className={`w-10 h-6 flex items-center rounded-full p-1 transition ${checked?'bg-lime-500':'bg-zinc-700'}`}>
      <span className={`bg-white w-4 h-4 rounded-full transform transition ${checked?'translate-x-4':''}`}></span>
    </span>
  </label>
)
