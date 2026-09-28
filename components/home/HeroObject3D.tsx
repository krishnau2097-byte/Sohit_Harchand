'use client'

import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { animate, stagger, type JSAnimation } from 'animejs'
import 'animejs/adapters/three'
import { lerp } from '@/lib/motion'

/**
 * Floating 3D object beside the portrait (the plan's Spline slot, built in
 * Three.js so it needs no external scene file): a stack of gold, glass and
 * obsidian cards with an orbiting ring. Anime.js animates the Three.js
 * objects directly through its Three.js adapter.
 */
export default function HeroObject3D() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current!
    let w = host.clientWidth
    let h = host.clientHeight

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)

    const scene = new Scene()
    const pmrem = new PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const camera = new PerspectiveCamera(32, w / h, 0.1, 50)
    camera.position.set(0, 0, 6.2)

    const key = new DirectionalLight(new Color('#ffd9a0'), 2.2)
    key.position.set(3, 4, 5)
    scene.add(key)

    const pivot = new Group()
    const stack = new Group()
    pivot.add(stack)
    scene.add(pivot)

    const geo = new RoundedBoxGeometry(1.7, 1.08, 0.07, 6, 0.1)
    const gold = new MeshStandardMaterial({ color: '#e2c285', metalness: 1, roughness: 0.28 })
    const glass = new MeshPhysicalMaterial({ color: '#f6e2b8', metalness: 0, roughness: 0.12, transmission: 0.92, thickness: 0.6, ior: 1.4, transparent: true })
    const obsidian = new MeshPhysicalMaterial({ color: '#15120e', metalness: 0.55, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 })

    const cards = [gold, glass, obsidian].map((mat, i) => {
      const m = new Mesh(geo, mat)
      m.position.set((i - 1) * 0.22, (1 - i) * 0.2, (i - 1) * 0.42)
      m.rotation.set(-0.12, 0.38, 0.06 * (i - 1))
      stack.add(m)
      return m
    })

    const emblem = new Mesh(new SphereGeometry(0.13, 32, 32), gold)
    emblem.position.set(0.18, -0.12, 0.52)
    stack.add(emblem)

    const ring = new Mesh(new TorusGeometry(1.45, 0.01, 12, 160), gold)
    ring.rotation.set(1.2, 0.2, 0)
    pivot.add(ring)
    const moon = new Mesh(new SphereGeometry(0.06, 24, 24), new MeshStandardMaterial({ color: '#ff6a3d', emissive: '#ff6a3d', emissiveIntensity: 0.6 }))
    ring.add(moon)

    /* Entrance + idle float, all through the Anime.js Three.js adapter. */
    const anims: JSAnimation[] = []
    anims.push(animate(stack, { scale: [0.001, 1], rotateY: [-140, 0], duration: 1800, ease: 'out(4)' }))
    anims.push(animate(ring, { scale: [0.4, 1], opacity: [0, 1], duration: 1600, delay: 300, ease: 'out(3)' }))
    anims.push(
      animate(cards, {
        y: (_?: unknown, i = 0) => `+=${0.09 + i * 0.03}`,
        rotateZ: (_?: unknown, i = 0) => `+=${4 - i * 3}`,
        duration: (_?: unknown, i = 0) => 2400 + i * 500,
        delay: stagger(220),
        loop: true,
        alternate: true,
        ease: 'inOut(2)',
      }),
    )

    let tx = 0
    let ty = 0
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 0.9
      ty = (e.clientY / window.innerHeight - 0.5) * 0.6
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(host)

    const ro = new ResizeObserver(() => {
      w = host.clientWidth
      h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    ro.observe(host)

    let raf = 0
    let angle = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      pivot.rotation.y = lerp(pivot.rotation.y, tx, 0.05)
      pivot.rotation.x = lerp(pivot.rotation.x, ty, 0.05)
      stack.rotation.y += 0.0025
      angle += 0.012
      moon.position.set(Math.cos(angle) * 1.45, Math.sin(angle) * 1.45, 0)
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      anims.forEach((a) => a.revert())
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
      ro.disconnect()
      scene.traverse((o) => {
        const m = o as Mesh
        if (m.isMesh) {
          m.geometry.dispose()
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          mats.forEach((mat) => mat.dispose())
        }
      })
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={ref} className="h-full w-full" />
}
