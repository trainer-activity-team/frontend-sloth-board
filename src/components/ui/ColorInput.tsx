import { useCallback, useId } from 'react'

export interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  name?: string
}

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

export function ColorInput({
  label,
  value,
  onChange,
  error,
  name,
}: ColorInputProps) {
  const id = useId()
  const pickerValue = HEX_PATTERN.test(value) ? value : '#3B82F6'

  const handleHexChange = useCallback(
    (raw: string) => {
      const normalized = raw.startsWith('#') ? raw : `#${raw}`
      onChange(normalized.toUpperCase())
    },
    [onChange],
  )

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm uppercase tracking-wide text-muted"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={pickerValue}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="size-10 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
          aria-label={label}
        />
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={(event) => handleHexChange(event.target.value)}
          placeholder="#3B82F6"
          className={`flex-1 rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-disabled focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
