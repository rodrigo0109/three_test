import { useEffect, useRef } from 'react'
import { cleanUpScene, mountScene } from './Script'
import './Scene.css'

export default function Scene() {
  const mountRef = useRef(null)

  useEffect(() => {
    //init scene
    mountScene(mountRef)
    
    //clean up scene
    return () => {
      cleanUpScene()
    }
  }, [])

  return (
    <>
      <div 
        id="container3D" 
        className="scene_container" 
        ref={mountRef}
      >

      </div>
    </>
  )
}