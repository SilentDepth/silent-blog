import { match } from 'arktype'
import { useEffect, useState } from 'react'
import MingcuteComputerLine from '~icons/mingcute/computer-line'
import MingcuteMoonStarsLine from '~icons/mingcute/moon-stars-line'
import MingcuteSunLine from '~icons/mingcute/sun-line'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="size-8 hover:bg-olive-100 dark:hover:bg-mist-700 rounded-md grid place-items-center *:row-start-1 *:col-start-1"
      onClick={toggleMode}
    >
      {match({
        '"light"': () => <MingcuteSunLine className="size-5" />,
        '"dark"': () => <MingcuteMoonStarsLine className="size-5" />,
        '"auto"': () => <MingcuteComputerLine className="size-5" />,
        default: 'never',
      })(mode)}
    </button>
  )
}
