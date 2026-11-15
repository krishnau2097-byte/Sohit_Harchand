'use client'

import { useEffect, useRef, type RefObject } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from 'three'
import { animate, createDraggable, spring, onScroll, stagger, type JSAnimation } from 'animejs'
import 'animejs/adapters/three'
import type { Project } from '@/content/projects'
import { projectImage } from '@/lib/projectMock'
import { lerp } from '@/lib/motion'

export type RibbonApi = { focus: (index: number) => void }

type Props = {
  projects: Project[]
  onActive: (index: number) => void
  onOpen: (index: number) => void
  apiRef: RefObject<RibbonApi | null>
  scrollTarget: RefObject<HTMLElement | null>
}

const TAU = Math.PI * 2

/** A plane bent onto a cylinder of radius R, so every screen curves with the ring. */
function bentPlane(w: number, h: number, R: number, segments: number) {
  const geo = new PlaneGeometry(w, h, segments, 1)
  const pos = geo.attributes.position as BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const a = x / R
    pos.setXYZ(i, Math.sin(a) * R, pos.getY(i), Math.cos(a) * R)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function roundedCanvasTexture(src: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1280
  canvas.height = 800
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  const img = new Image()
  img.decoding = 'async'
  img.onload = () => {
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(0, 0, canvas.width, canvas.height, 34)
    ctx.clip()
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.restore()
    tex.needsUpdate = true
  }
  img.src = src
  return tex
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(226,194,133,0.55)')
  g.addColorStop(0.4, 'rgba(226,194,133,0.14)')
  g.addColorStop(1, 'rgba(226,194,133,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

/**
 * The 3D project ribbon from the reference video: project screens on curved
 * planes around a tilted ring. Scroll rotates it (onScroll sync), drag spins
 * it with spring inertia (createDraggable on a plain object + spring),
 * hover lifts a card and click opens the project.
 */
export default function Ribbon3D({ projects, onActive, onOpen, apiRef, scrollTarget }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const cbs = useRef({ onActive, onOpen })

  useEffect(() => {
    cbs.current = { onActive, onOpen }
  })

  useEffect(() => {
    const host = hostRef.current!
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
    renderer.domElement.style.touchAction = 'pan-y'
    host.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(34, w / h, 0.1, 100)
    const N = projects.length
    const R = 4.3
    const step = TAU / N
    const cardW = Math.min(3.1, step * R * 0.88)
    const cardH = cardW / 1.6

    const placeCamera = () => {
      const narrow = w / h < 1.2
      camera.position.set(0, 1.35, R + (narrow ? 8.5 : 6.4))
      camera.lookAt(0, -0.15, 0)
    }
    placeCamera()

    const tilt = new Group()
    tilt.rotation.set(0.05, 0, -0.07)
    const intro = new Group()
    const ribbon = new Group()
    intro.add(ribbon)
    tilt.add(intro)
    scene.add(tilt)

    const geo = bentPlane(cardW, cardH, R, 48)
    const reveal = projects.map(() => ({ v: 0 }))
    const hover = projects.map(() => ({ v: 0 }))
    const meshes = projects.map((p, i) => {
      const mat = new MeshBasicMaterial({ map: roundedCanvasTexture(projectImage(p)), side: DoubleSide, transparent: true, toneMapped: false, depthWrite: false })
      const m = new Mesh(geo, mat)
      m.rotation.y = i * step
      m.userData.baseY = Math.sin(i * step * 2) * 0.32
      m.userData.index = i
      ribbon.add(m)
      return m
    })

    // Gold dust particle field around the ring.
    const COUNT = 700
    const pts = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * TAU
      const rad = R * (0.55 + Math.random() * 1.2)
      pts[i * 3] = Math.cos(a) * rad
      pts[i * 3 + 1] = (Math.random() - 0.5) * 5
      pts[i * 3 + 2] = Math.sin(a) * rad
    }
    const dustGeo = new BufferGeometry()
    dustGeo.setAttribute('position', new BufferAttribute(pts, 3))
    const dust = new Points(dustGeo, new PointsMaterial({ color: '#e2c285', size: 0.028, transparent: true, opacity: 0.55, depthWrite: false }))
    tilt.add(dust)

    const glowTex = glowTexture()
    const glow = new Mesh(new PlaneGeometry(R * 3.4, R * 3.4), new MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending }))
    glow.rotation.x = -Math.PI / 2
    glow.position.y = -cardH * 0.9
    tilt.add(glow)

    /* Rotation state: scroll + drag + focus offset + slow auto drift. */
    const state = { scroll: 0, offset: 0, auto: 0 }
    const proxy = { x: 0, y: 0 }
    const DRAG_K = 0.0042
    let shown = -Math.PI / 2
    let pointerInside = false
    let dragging = false
    let moved = 0
    let hovered = -1
    let active = -1
    const anims: JSAnimation[] = []

    const scrollAnim = animate(state, {
      scroll: [0, Math.PI * 1.1],
      ease: 'linear',
      autoplay: onScroll({ target: scrollTarget.current ?? host, enter: 'bottom top', leave: 'top bottom', sync: true }),
    })

    const draggable = createDraggable(proxy, {
      trigger: host,
      y: false,
      container: [-1e7, 1e7, 1e7, -1e7],
      cursor: false,
      velocityMultiplier: 1.6,
      releaseEase: spring({ stiffness: 40, damping: 16 }),
      onGrab: () => {
        dragging = true
        moved = 0
        host.style.cursor = 'grabbing'
      },
      onDrag: () => {
        moved++
      },
      onRelease: () => {
        dragging = false
        host.style.cursor = 'grab'
      },
    })

    const target = () => state.scroll + state.offset + state.auto - proxy.x * DRAG_K

    apiRef.current = {
      focus: (i: number) => {
        const cur = target()
        let goal = i * step
        goal += Math.round((cur - goal) / TAU) * TAU
        anims.push(animate(state, { offset: state.offset + (goal - cur), duration: 1300, ease: 'out(4)' }))
      },
    }

    /* Hover + click via raycasting. */
    const ray = new Raycaster()
    const ndc = new Vector2()
    const pick = (e: PointerEvent | MouseEvent) => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      const hit = ray.intersectObjects(meshes, false)[0]
      if (!hit) return -1
      const m = hit.object as Mesh
      // Only the side facing the viewer is clickable.
      const facing = Math.cos(m.userData.index * step - shown)
      return facing > 0.2 ? (m.userData.index as number) : -1
    }
    const setHover = (i: number) => {
      if (i === hovered) return
      if (hovered >= 0) anims.push(animate(hover[hovered], { v: 0, duration: 500, ease: 'out(3)' }))
      hovered = i
      if (i >= 0) anims.push(animate(hover[i], { v: 1, duration: 600, ease: 'out(4)' }))
      host.style.cursor = i >= 0 ? 'pointer' : 'grab'
    }
    const onMove = (e: PointerEvent) => {
      if (dragging) return setHover(-1)
      setHover(pick(e))
    }
    const onEnter = () => {
      pointerInside = true
      host.style.cursor = 'grab'
    }
    const onLeave = () => {
      pointerInside = false
      setHover(-1)
      host.style.cursor = 'default'
    }
    const onClick = (e: MouseEvent) => {
      if (moved > 2) return
      const i = pick(e)
      if (i >= 0) cbs.current.onOpen(i)
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('click', onClick)

    /* Entrance when the ribbon first comes into view (Three.js adapter). */
    let entered = false
    let visible = false
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !entered) {
        entered = true
        anims.push(animate(intro, { scale: [0.55, 1], rotateX: [28, 0], y: [-1.4, 0], duration: 2000, ease: 'out(4)' }))
        anims.push(animate(reveal, { v: [0, 1], duration: 1100, delay: stagger(90, { start: 200 }), ease: 'out(3)' }))
        anims.push(animate(dust, { opacity: [0, 0.55], duration: 2400, ease: 'out(2)' }))
      }
    })
    io.observe(host)

    const ro = new ResizeObserver(() => {
      w = host.clientWidth
      h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      placeCamera()
      camera.updateProjectionMatrix()
    })
    ro.observe(host)

    // Back screens fade to paper in light mode and to shadow in dark mode.
    let lightTheme = document.documentElement.dataset.theme !== 'dark'
    const onTheme = () => (lightTheme = document.documentElement.dataset.theme !== 'dark')
    window.addEventListener('themechange', onTheme)

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible || document.hidden) return
      if (!dragging && !pointerInside) state.auto += dt * 0.06
      shown = lerp(shown, target(), 0.1)
      ribbon.rotation.y = -shown
      dust.rotation.y = -shown * 0.35
      for (let i = 0; i < N; i++) {
        const m = meshes[i]
        const facing = Math.cos(i * step - shown)
        const f = Math.max(0, facing)
        const rv = reveal[i].v
        const hv = hover[i].v
        const mat = m.material as MeshBasicMaterial
        mat.opacity = (0.14 + 0.86 * f * f) * rv
        mat.color.setScalar((lightTheme ? 0.82 + 0.18 * f : 0.4 + 0.6 * f) + hv * 0.08)
        m.position.y = m.userData.baseY - (1 - rv) * 0.8 + hv * 0.12
        m.scale.setScalar(1 + hv * 0.045)
      }
      const idx = ((Math.round(shown / step) % N) + N) % N
      if (idx !== active) {
        active = idx
        cbs.current.onActive(idx)
      }
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('themechange', onTheme)
      anims.forEach((a) => a.revert())
      scrollAnim.revert()
      draggable.revert()
      io.disconnect()
      ro.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('click', onClick)
      apiRef.current = null
      meshes.forEach((m) => {
        const mat = m.material as MeshBasicMaterial
        mat.map?.dispose()
        mat.dispose()
      })
      geo.dispose()
      dustGeo.dispose()
      dust.material.dispose()
      glowTex.dispose()
      glow.geometry.dispose()
      ;(glow.material as MeshBasicMaterial).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [projects, apiRef, scrollTarget])

  return <div ref={hostRef} className="h-full w-full" />
}
