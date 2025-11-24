import './style.css'

const ROOM_WIDTH = 256
const ROOM_HEIGHT = 224

type Palette = Record<string, string>

interface Sprite {
  name: string
  rows: string[]
  width: number
  height: number
}

interface AnimatedSprite {
  frames: Sprite[]
  duration: number
}

type DrawableSprite = Sprite | AnimatedSprite

type Anchor = 'top-left' | 'center' | 'bottom'

interface SceneObject {
  sprite: DrawableSprite
  x: number
  y: number
  anchor?: Anchor
  bobAmplitude?: number
  bobSpeed?: number
}

interface Hero extends SceneObject {
  speed: number
  moving: boolean
  radius: number
}

const palette: Palette = {
  '.': 'transparent',
  k: '#2a150a',
  L: '#8b4e24',
  f: '#f4ead0',
  H: '#f8dcaa',
  B: '#335289',
  u: '#f7c9a4',
  b: '#263b6b',
  G: '#3d6d3f',
  V: '#7cb349',
  y: '#c9965b',
  s: '#a36f3f',
  c: '#4a2b15',
  C: '#2c170c',
  P: '#dec497',
  M: '#c8773c',
  w: '#5c351a',
  m: '#915521',
  Y: '#f3d386',
  A: '#cda041',
  a: '#b37d33',
  r: '#69361a',
  t: '#3d2a1a',
  p: '#b44c4c',
  q: '#2d5c1f',
  Q: '#4f8c32',
  g: '#6b8d2b',
  l: '#f8f1df',
}

const createSprite = (name: string, rows: string[]): Sprite => {
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0)
  return {
    name,
    rows,
    width,
    height: rows.length,
  }
}

const sprites = {
  bed: createSprite('bed', [
    '....kkkkkkkkkkkkkkkkkkkkkkkk....',
    '..kkLLLLLLLLLLLLLLLLLLLLLLLLkk..',
    '.kLLLLLLLLLLLLLLLLLLLLLLLLLLLLk.',
    '.kLLffffffffffHHHHffffffffffLLk.',
    '.kLLffBBBBBBBBBBBBBBBBBBBBffLLk.',
    '.kLLffBBBBBuUUUUuBBBBBBBBffLLk.',
    '.kLLffBBBBBuUUUUuBBBBBBBBffLLk.',
    '.kLLffbbbbbbbbbbbbbbbbbbffLLk.',
    '.kLLffGGGGGGGGGGGGGGGGGGffLLk.',
    '.kLLffGGGVVVVVVVVVVGGGGGffLLk.',
    '.kLLffffffffffffffffffffffLLk.',
    '.kLLLLLLLLLLLLLLLLLLLLLLLLLLk.',
    '.kLLLLLLLLLLLLLLLLLLLLLLLLLLk.',
    '..kkkkkkkkkkkkkkkkkkkkkkkkkk..',
  ]),
  jarShelf: createSprite('jarShelf', [
    '....yyyyyyyy........',
    '..yyLLLLLLLLyy......',
    '..yyLLLLLLLLyy......',
    '..yyLLLLLLLLyy......',
    '..yyLLLLLLLLyy......',
    '..yyssssssssyy......',
    '....yyyyyyyy........',
    '..ccPPPPPPPPcc......',
    '.cPPffffffPPPc......',
    '.cPPffffffPPPc......',
    '.cPPPPPPPPPPPc......',
    '..ccPPPPPPPPcc......',
    '....yyyyyyyy........',
    '..ccPPPPPPPPcc......',
    '.cPPffffffPPPc......',
    '.cPPffffffPPPc......',
    '.cPPPPPPPPPPPc......',
    '..ccPPPPPPPPcc......',
  ]),
  wallShelf: createSprite('wallShelf', [
    'cccccccccccccccc',
    'CCCCCCCCCCCCCCCC',
    'LLLLLLLLLLLLLLLL',
    'LLLLLLLLLLLLLLLL',
    'ssssssssssssssss',
    'ssssssssssssssss',
  ]),
  table: createSprite('table', [
    '....yyyyyyyyyyyyyyyyyyyy....',
    '..yyLLLLLLLLLLLLLLLLLLLLyy..',
    '..yyLLLLLLLLLLLLLLLLLLLLyy..',
    '..yyLLLLLLLLLLLLLLLLLLLLyy..',
    '..yyLLLLLLLLLLLLLLLLLLLLyy..',
    '..yyMMMMMMMMMMMMMMMMMMMMyy..',
    '..yyMMMMMMMMMMMMMMMMMMMMyy..',
    '..yyMMMMMMMMMMMMMMMMMMMMyy..',
    '..yyMMMMMMMMMMMMMMMMMMMMyy..',
    '....wwwwwwwwwwwwwwwwwwww....',
    '....wwwwwwwwwwwwwwwwwwww....',
    '....ww....ww......ww....ww....',
    '....ww....ww......ww....ww....',
  ]),
  bench: createSprite('bench', [
    '....LLLLLLLLLLLLLLLL....',
    '..LLmmmmmmmmmmmmmmLL..',
    '..LLmmmmmmmmmmmmmmLL..',
    '..LLmmmmmmmmmmmmmmLL..',
    '..wwLLLLLLLLLLLLLLww..',
    '..wwwwwwwwwwwwwwwwww..',
  ]),
  chest: createSprite('chest', [
    '....cccccccccccc....',
    '..ccYYYYYYYYYYYYcc..',
    '.cYYAAAAAAAAAAAAYYc.',
    '.cYYAAAAAAAAAAAAYYc.',
    '.cYYaaaaaaaaaaaaYYc.',
    '.cYYaaaaaaaaaaaaYYc.',
    '.cYYMMMMMMMMMMMMYYc.',
    '..ccMMMMMMMMMMMMcc..',
    '....ccrrrrrrrrcc....',
  ]),
  crate: createSprite('crate', [
    '..rrrrrrrrrrrr..',
    '.rLLLLLLLLLLLLr.',
    '.rLrrLLLLLLrrLr.',
    '.rLrrLLLLLLrrLr.',
    '.rLLLLrrrrLLLLr.',
    '.rLLLLrrrrLLLLr.',
    '.rLLLLLLLLLLLLr.',
    '..rrrrrrrrrrrr..',
  ]),
  lamp: createSprite('lamp', [
    '....gggg....',
    '..ggGGGGgg..',
    '..ggGGGGgg..',
    '....GGGG....',
    '....GGGG....',
    '....gggg....',
    '....gggg....',
    '....llll....',
  ]),
  linkIdle: createSprite('linkIdle', [
    '....qqqqqq....',
    '..qqQQQQQQqq..',
    '..qqQQAAQQqq..',
    '..qqQAAAAQqq..',
    '..qqQAAuAQqq..',
    '..qqqquuqqqq..',
    '..qqqqppqqqq..',
    '..LLttttttLL..',
    '.LLttttttttLL.',
    '.wwttwwwwttww.',
    '.wwttwwwwttww.',
    '....ww..ww....',
  ]),
  linkBlink: createSprite('linkBlink', [
    '....qqqqqq....',
    '..qqQQQQQQqq..',
    '..qqQQQQQQqq..',
    '..qqQAAAAQqq..',
    '..qqQAAuAQqq..',
    '..qqqquuqqqq..',
    '..qqqqppqqqq..',
    '..LLttttttLL..',
    '.LLttttttttLL.',
    '.wwttwwwwttww.',
    '.wwttwwwwttww.',
    '....ww..ww....',
  ]),
  floorShadow: createSprite('floorShadow', [
    '................',
    '....kkkkkkkk....',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '....kkkkkkkk....',
    '................',
  ]),
}

const heroAnimation: AnimatedSprite = {
  frames: [sprites.linkIdle, sprites.linkBlink],
  duration: 2800,
}

const sceneObjects: SceneObject[] = [
  { sprite: sprites.wallShelf, x: 30, y: 56 },
  { sprite: sprites.jarShelf, x: 20, y: 76 },
  { sprite: sprites.bed, x: 52, y: 92 },
  { sprite: sprites.bench, x: 76, y: 174 },
  { sprite: sprites.bench, x: 150, y: 174 },
  { sprite: sprites.chest, x: 186, y: 172 },
  { sprite: sprites.crate, x: 40, y: 180 },
]

const hero: Hero = {
  sprite: heroAnimation,
  x: 128,
  y: 180,
  anchor: 'bottom',
  bobAmplitude: 0.6,
  bobSpeed: 0.004,
  speed: 0.08,
  moving: false,
  radius: 3,
}

const heroShadow: SceneObject = {
  sprite: sprites.floorShadow,
  x: hero.x,
  y: hero.y,
  anchor: 'center',
}

const canvas = document.createElement('canvas')
canvas.width = ROOM_WIDTH
canvas.height = ROOM_HEIGHT
canvas.className = 'room-canvas'

const root = document.querySelector<HTMLDivElement>('#app')
const wrapper = document.createElement('div')
wrapper.className = 'scene-wrapper'
wrapper.appendChild(canvas)

const caption = document.createElement('p')
caption.className = 'instructions'
caption.textContent =
  "Use the arrow keys to explore Lind's room. More portfolio secrets coming soon."

wrapper.appendChild(caption)
root?.appendChild(wrapper)

const ctx = canvas.getContext('2d')
if (!ctx) {
  throw new Error('Unable to obtain rendering context')
}

ctx.imageSmoothingEnabled = false

const pressedKeys = new Set<string>()

window.addEventListener('keydown', (event) => {
  if (
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
  ) {
    event.preventDefault()
    pressedKeys.add(event.key)
  }
})

window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.key)
})

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const heroBounds = {
  minX: 20,
  maxX: 236,
  minY: 90,
  maxY: 210,
}

const collides = () => false

const updateHero = (delta: number) => {
  let dirX = 0
  let dirY = 0
  if (pressedKeys.has('ArrowLeft')) dirX -= 1
  if (pressedKeys.has('ArrowRight')) dirX += 1
  if (pressedKeys.has('ArrowUp')) dirY -= 1
  if (pressedKeys.has('ArrowDown')) dirY += 1

  if (dirX !== 0 || dirY !== 0) {
    const length = Math.hypot(dirX, dirY) || 1
    dirX /= length
    dirY /= length
    hero.moving = true
    hero.bobAmplitude = 0
  } else {
    hero.moving = false
    hero.bobAmplitude = 0.6
  }

  const distance = hero.speed * delta
  const targetX = clamp(hero.x + dirX * distance, heroBounds.minX, heroBounds.maxX)
  const targetY = clamp(hero.y + dirY * distance, heroBounds.minY, heroBounds.maxY)

  const tryX = !collides(targetX, hero.y)
  if (tryX) {
    hero.x = targetX
  }

  const tryY = !collides(hero.x, targetY)
  if (tryY) {
    hero.y = targetY
  }

  heroShadow.x = hero.x
  heroShadow.y = hero.y - 2
}

const drawBackground = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#0c0503'
  context.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT)
  drawWalls(context)
  drawDoorway(context)
  drawFloorBoards(context)
  drawRug(context)
  drawEntryStep(context)
  drawLightFalloff(context)
}

const drawWalls = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#2d1407'
  context.fillRect(8, 8, 240, 56)
  context.fillStyle = '#b48652'
  context.fillRect(16, 16, 224, 40)
  context.fillStyle = '#6c3c1c'
  context.fillRect(16, 56, 224, 8)
  context.fillStyle = '#3a1d0c'
  context.fillRect(20, 64, 216, 6)
  // Beams
  context.fillStyle = '#8d5530'
  context.fillRect(16, 28, 224, 1)
  context.fillRect(16, 40, 224, 1)
}

const drawDoorway = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#1f0d06'
  context.fillRect(104, 16, 48, 56)
  context.fillStyle = '#d9c08c'
  const glyph = [
    '..111100001111..',
    '.1000000000001.',
    '.1088001108801.',
    '.1000000000001.',
    '.1110011110011.',
    '.1000000000001.',
    '.1088001108801.',
    '.1000000000001.',
    '..111100001111..',
  ]
  glyph.forEach((row, y) => {
    ;[...row].forEach((cell, x) => {
      if (cell === '1') {
        context.fillRect(110 + x, 20 + y, 1, 1)
      }
      if (cell === '8') {
        context.fillStyle = '#b98d4f'
        context.fillRect(110 + x, 20 + y, 1, 1)
        context.fillStyle = '#d9c08c'
      }
    })
  })
  context.fillStyle = '#713d1c'
  context.fillRect(112, 58, 32, 10)
  context.fillStyle = '#c09158'
  context.fillRect(116, 60, 24, 6)
}

const drawFloorBoards = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#b57038'
  context.fillRect(24, 72, 208, 132)
  for (let x = 24; x < 232; x += 6) {
    context.fillStyle = x % 12 === 0 ? '#8a4b24' : '#a35c2c'
    context.fillRect(x, 72, 2, 132)
  }
  for (let y = 76; y < 204; y += 14) {
    context.fillStyle = '#8f4f28'
    context.fillRect(24, y, 208, 1)
  }
}

const drawRug = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#8d2a2d'
  context.fillRect(76, 108, 108, 76)
  context.fillStyle = '#c24a4e'
  context.fillRect(80, 112, 100, 68)
  context.fillStyle = '#f2d29a'
  context.fillRect(84, 116, 92, 60)
  context.fillStyle = '#7a1f24'
  context.fillRect(88, 120, 84, 52)
  context.fillStyle = '#f2d29a'
  for (let y = 124; y <= 160; y += 8) {
    context.fillRect(88, y, 84, 2)
  }
}

const drawEntryStep = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#442312'
  context.fillRect(48, 196, 160, 8)
  context.fillStyle = '#64331a'
  context.fillRect(60, 204, 136, 6)
  context.fillStyle = '#1d0b05'
  context.fillRect(0, 208, ROOM_WIDTH, 16)
}

const drawLightFalloff = (context: CanvasRenderingContext2D) => {
  const gradient = context.createRadialGradient(128, 120, 20, 128, 120, 180)
  gradient.addColorStop(0, 'rgba(255, 220, 150, 0.15)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.65)')
  context.fillStyle = gradient
  context.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT)
}

const drawHud = (context: CanvasRenderingContext2D) => {
  context.save()
  context.font = '6px "Press Start 2P", monospace'
  context.fillStyle = '#0a0604'
  context.fillRect(12, 6, 232, 24)
  context.strokeStyle = '#f6e6c5'
  context.strokeRect(14, 8, 38, 20)
  context.fillStyle = '#f6e6c5'
  context.fillText('B', 20, 22)
  context.fillText('Y', 32, 22)
  context.fillText('X', 44, 22)
  context.fillText('000', 68, 20)
  context.fillText('00', 108, 20)
  context.fillText('30', 138, 20)

  const drawHeart = (x: number, y: number, filled: boolean) => {
    const color = filled ? '#d7545c' : '#3c1b24'
    context.fillStyle = color
    const heartPixels = [
      '.XX..XX.',
      'XXXXXXXX',
      'XXXXXXXX',
      '.XXXXXX.',
      '..XXXX..',
      '...XX...',
    ]
    heartPixels.forEach((row, rowIndex) => {
      [...row].forEach((pixel, colIndex) => {
        if (pixel === 'X') {
          context.fillRect(x + colIndex, y + rowIndex, 1, 1)
        }
      })
    })
  }

  drawHeart(190, 12, true)
  drawHeart(204, 12, true)
  drawHeart(218, 12, true)
  context.restore()
}

const isAnimated = (sprite: DrawableSprite): sprite is AnimatedSprite =>
  (sprite as AnimatedSprite).frames !== undefined

const sampleSprite = (sprite: DrawableSprite, time: number): Sprite => {
  if (!isAnimated(sprite)) {
    return sprite
  }
  const frameCount = sprite.frames.length
  const frameWindow = sprite.duration / frameCount
  const frameIndex = Math.floor((time % sprite.duration) / frameWindow)
  return sprite.frames[frameIndex]
}

const drawSprite = (
  context: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  anchor: Anchor = 'top-left',
) => {
  let drawX = x
  let drawY = y

  if (anchor === 'center') {
    drawX -= sprite.width / 2
    drawY -= sprite.height / 2
  } else if (anchor === 'bottom') {
    drawY -= sprite.height
  }

  for (let row = 0; row < sprite.height; row += 1) {
    const line = sprite.rows[row] ?? ''
    for (let col = 0; col < sprite.width; col += 1) {
      const key = line[col] ?? '.'
      if (key === '.') continue
      const color = palette[key]
      if (!color) continue
      context.fillStyle = color
      context.fillRect(drawX + col, drawY + row, 1, 1)
    }
  }
}

const renderScene = (timestamp: number) => {
  drawBackground(ctx)
  sceneObjects.forEach((object) => {
    const sprite = sampleSprite(object.sprite, timestamp)
    const bobOffset =
      object.bobAmplitude && object.bobSpeed
        ? Math.sin(timestamp * object.bobSpeed) * object.bobAmplitude
        : 0
    drawSprite(ctx, sprite, object.x, object.y + bobOffset, object.anchor)
  })
  const shadowSprite = sampleSprite(heroShadow.sprite, timestamp)
  drawSprite(ctx, shadowSprite, heroShadow.x, heroShadow.y, heroShadow.anchor)
  const heroSprite = sampleSprite(hero.sprite, timestamp)
  drawSprite(ctx, heroSprite, hero.x, hero.y, hero.anchor)
  drawHud(ctx)
}

let previousTime = 0
const loop = (timestamp: number) => {
  const delta = previousTime ? timestamp - previousTime : 0
  previousTime = timestamp
  updateHero(delta)
  renderScene(timestamp)
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
