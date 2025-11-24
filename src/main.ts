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
  e: '#f2d9b1',
  E: '#c49b72',
  d: '#8b5639',
  D: '#5b2f1a',
  n: '#6b3c20',
  N: '#472412',
  i: '#1c1209',
  I: '#2b180d',
  x: '#4f2a19',
  X: '#6c3b22',
  z: '#a83640',
  Z: '#e58b76',
  v: '#7a2b33',
  h: '#3b1d11',
}

const TILE_SIZE = 8

const tileSet = {
  wallCap: [
    'iiiiiiii',
    'IIIIIIII',
    'iiiiiiii',
    'IIIIIIII',
    'iiiiiiii',
    'IIIIIIII',
    'iiiiiiii',
    'IIIIIIII',
  ],
  wallInset: [
    'EEEEEEEE',
    'EEEEEEEE',
    'eeeeeeee',
    'eeeeeeee',
    'EEEEEEEE',
    'EEEEEEEE',
    'eeeeeeee',
    'eeeeeeee',
  ],
  wallPanel: [
    'dddddddd',
    'DDDDDDDD',
    'dddddddd',
    'DDDDDDDD',
    'dddddddd',
    'DDDDDDDD',
    'dddddddd',
    'DDDDDDDD',
  ],
  wallShadow: [
    'hhhhhhhh',
    'HHHHHHHH',
    'hhhhhhhh',
    'HHHHHHHH',
    'hhhhhhhh',
    'HHHHHHHH',
    'hhhhhhhh',
    'HHHHHHHH',
  ],
  wallBase: [
    'nnnnnnnn',
    'NNNNNNNN',
    'nnnnnnnn',
    'NNNNNNNN',
    'nnnnnnnn',
    'NNNNNNNN',
    'nnnnnnnn',
    'NNNNNNNN',
  ],
  floorPlankLight: [
    'AAaaAAaa',
    'AAAAaaaa',
    'AAaaAAaa',
    'AAAAaaaa',
    'AAaaAAaa',
    'AAAAaaaa',
    'AAaaAAaa',
    'AAAAaaaa',
  ],
  floorPlankDark: [
    'ttTTttTT',
    'ttTTttTT',
    'tTTttTTt',
    'ttTTttTT',
    'ttTTttTT',
    'tTTttTTt',
    'ttTTttTT',
    'ttTTttTT',
  ],
  floorNail: [
    'ttTTttTT',
    'ttTTttTT',
    'tTTttTTt',
    'ttTTttTT',
    'tttNNttt',
    'ttTTttTT',
    'ttTTttTT',
    'ttTTttTT',
  ],
  rugCenter: [
    'pppppppp',
    'PPPPPPPP',
    'pppppppp',
    'PPPPPPPP',
    'pppppppp',
    'PPPPPPPP',
    'pppppppp',
    'PPPPPPPP',
  ],
  rugInner: [
    'zzzzzzzz',
    'zZZZZZzz',
    'zzzzzzzz',
    'zZZZZZzz',
    'zzzzzzzz',
    'zZZZZZzz',
    'zzzzzzzz',
    'zZZZZZzz',
  ],
  rugEdgeHorizontal: [
    'rrrrrrrr',
    'rrrrrrrr',
    'rrrrrrrr',
    'zzzzzzzz',
    'ZZZZZZZZ',
    'pppppppp',
    'pppppppp',
    'pppppppp',
  ],
  rugEdgeVerticalLeft: [
    'rrrrrrrr',
    'zzzzzzzz',
    'ZZZZZZZZ',
    'pppppppp',
    'pppppppp',
    'ZZZZZZZZ',
    'zzzzzzzz',
    'rrrrrrrr',
  ],
  rugEdgeVerticalRight: [
    'rrrrrrrr',
    'zzzzzzzz',
    'ZZZZZZZZ',
    'pppppppp',
    'pppppppp',
    'ZZZZZZZZ',
    'zzzzzzzz',
    'rrrrrrrr',
  ],
  rugCornerNW: [
    'rrrrrrrr',
    'rrrrrrrr',
    'rrzzzzzz',
    'rrzzzzzz',
    'rrZZZZZZ',
    'rrZZZZZZ',
    'rrpppppp',
    'rrpppppp',
  ],
  rugCornerNE: [
    'rrrrrrrr',
    'rrrrrrrr',
    'zzzzzzrr',
    'zzzzzzrr',
    'ZZZZZZrr',
    'ZZZZZZrr',
    'pppppprr',
    'pppppprr',
  ],
  rugCornerSW: [
    'rrpppppp',
    'rrpppppp',
    'rrZZZZZZ',
    'rrZZZZZZ',
    'rrzzzzzz',
    'rrzzzzzz',
    'rrrrrrrr',
    'rrrrrrrr',
  ],
  rugCornerSE: [
    'pppppprr',
    'pppppprr',
    'ZZZZZZrr',
    'ZZZZZZrr',
    'zzzzzzrr',
    'zzzzzzrr',
    'rrrrrrrr',
    'rrrrrrrr',
  ],
  rugFringe: [
    '........',
    'YYYYYYYY',
    '........',
    'YYYYYYYY',
    '........',
    'YYYYYYYY',
    '........',
    'YYYYYYYY',
  ],
} as const

type TileName = keyof typeof tileSet

const stampTile = (
  context: CanvasRenderingContext2D,
  tileName: TileName,
  tileX: number,
  tileY: number,
) => {
  const tile = tileSet[tileName]
  for (let row = 0; row < TILE_SIZE; row += 1) {
    const line = tile[row] ?? ''
    for (let col = 0; col < TILE_SIZE; col += 1) {
      const key = line[col] ?? '.'
      if (key === '.') continue
      const color = palette[key]
      if (!color) continue
      context.fillStyle = color
      context.fillRect(
        tileX * TILE_SIZE + col,
        tileY * TILE_SIZE + row,
        1,
        1,
      )
    }
  }
}

const fillTiles = (
  context: CanvasRenderingContext2D,
  tileName: TileName,
  startX: number,
  startY: number,
  width: number,
  height: number,
) => {
  for (let tileY = startY; tileY < startY + height; tileY += 1) {
    for (let tileX = startX; tileX < startX + width; tileX += 1) {
      stampTile(context, tileName, tileX, tileY)
    }
  }
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
  { sprite: sprites.table, x: 96, y: 128 },
  { sprite: sprites.lamp, x: 122, y: 108 },
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
  "Arrow keys: wander this 16-bit take on Lind's room and discover what's next."

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
  fillTiles(context, 'wallCap', 0, 0, 32, 1)
  fillTiles(context, 'wallInset', 1, 1, 30, 1)
  fillTiles(context, 'wallPanel', 1, 2, 30, 1)
  fillTiles(context, 'wallShadow', 0, 3, 32, 1)
  fillTiles(context, 'wallBase', 0, 4, 32, 2)
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
  const startX = 2
  const startY = 9
  const width = 28
  const height = 16
  for (let tileY = 0; tileY < height; tileY += 1) {
    for (let tileX = 0; tileX < width; tileX += 1) {
      const worldX = startX + tileX
      const worldY = startY + tileY
      const useNail = (tileX + tileY) % 7 === 0 && tileY % 4 === 0
      const tileName: TileName = useNail
        ? 'floorNail'
        : (tileX + tileY) % 2 === 0
          ? 'floorPlankLight'
          : 'floorPlankDark'
      stampTile(context, tileName, worldX, worldY)
    }
  }
}

const drawRug = (context: CanvasRenderingContext2D) => {
  const rug = {
    x: 9,
    y: 13,
    width: 14,
    height: 8,
  }

  for (let ty = 0; ty < rug.height; ty += 1) {
    for (let tx = 0; tx < rug.width; tx += 1) {
      let tileName: TileName = 'rugCenter'
      const isLeft = tx === 0
      const isRight = tx === rug.width - 1
      const isTop = ty === 0
      const isBottom = ty === rug.height - 1

      if (isTop && isLeft) {
        tileName = 'rugCornerNW'
      } else if (isTop && isRight) {
        tileName = 'rugCornerNE'
      } else if (isBottom && isLeft) {
        tileName = 'rugCornerSW'
      } else if (isBottom && isRight) {
        tileName = 'rugCornerSE'
      } else if (isTop || isBottom) {
        tileName = 'rugEdgeHorizontal'
      } else if (isLeft) {
        tileName = 'rugEdgeVerticalLeft'
      } else if (isRight) {
        tileName = 'rugEdgeVerticalRight'
      } else {
        tileName = (tx + ty) % 2 === 0 ? 'rugInner' : 'rugCenter'
      }

      stampTile(context, tileName, rug.x + tx, rug.y + ty)
    }
  }

  fillTiles(context, 'rugFringe', rug.x, rug.y - 1, rug.width, 1)
  fillTiles(context, 'rugFringe', rug.x, rug.y + rug.height, rug.width, 1)
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
