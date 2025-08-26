import React from 'react'
import { createRoot } from 'react-dom/client'

function App(){
  return (
    <div style={{padding: 24, textAlign:'center', fontWeight: 800, fontSize: 24, color:'#bef264'}}>
      🚀 Nexora Online!
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
