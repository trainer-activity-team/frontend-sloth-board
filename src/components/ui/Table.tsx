import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

export function Table({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full min-w-[640px] border-collapse text-sm ${className}`}
        {...props}
      />
    </div>
  )
}

export function TableHead({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`bg-surface-hover ${className}`} {...props} />
}

export function TableBody({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />
}

export function TableRow({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b border-border last:border-b-0 ${className}`}
      {...props}
    />
  )
}

export function TableHeadCell({
  className = '',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted md:px-6 md:py-4 ${className}`}
      {...props}
    />
  )
}

export function TableCell({
  className = '',
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3.5 text-foreground md:px-6 ${className}`} {...props} />
  )
}
