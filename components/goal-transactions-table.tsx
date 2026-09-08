'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createColumnHelper,
  createSortedRowModel,
  flexRender,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  type SortingState,
  useTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatLongDate, formatSignedCurrencyFromCents } from '@/lib/format'
import type { GoalTransaction } from '@/lib/types'
import { cn } from '@/lib/utils'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})
const columnHelper = createColumnHelper<typeof features, GoalTransaction>()
const columns = columnHelper.columns([
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => (
      <div className="font-medium text-foreground">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('transactedOn', {
    header: 'Date',
    sortDescFirst: true,
    cell: (info) => (
      <span className="text-sm text-muted-foreground">
        {formatLongDate(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor('amountCents', {
    header: 'Amount',
    cell: (info) => formatSignedCurrencyFromCents(info.getValue()),
  }),
  columnHelper.accessor('createdBy', {
    header: 'By',
    cell: (info) => (
      <span className="text-sm text-muted-foreground">
        {info.getValue() || '—'}
      </span>
    ),
  }),
])

type GoalTransactionsTableProps = {
  goalSlug: string
  transactions: GoalTransaction[]
  readOnly?: boolean
}

export function GoalTransactionsTable({
  goalSlug,
  transactions,
  readOnly = false,
}: GoalTransactionsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'transactedOn', desc: true },
  ])
  const router = useRouter()

  const table = useTable({
    features,
    data: transactions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  })
  const sortHeader = table
    .getHeaderGroups()[0]
    ?.headers.find((header) => header.column.id === sorting[0]?.id)

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">Goal ledger</h2>
        <p className="text-sm text-muted-foreground">
          {transactions.length}{' '}
          {transactions.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>
      <div className="mt-2 flex justify-end sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" />}>
            Sort:{' '}
            {sortHeader
              ? flexRender(
                  sortHeader.column.columnDef.header,
                  sortHeader.getContext(),
                )
              : 'Default order'}
            {sorting[0] ? (
              sorting[0].desc ? (
                <ArrowDown aria-label="Descending" />
              ) : (
                <ArrowUp aria-label="Ascending" />
              )
            ) : (
              <ArrowUpDown aria-hidden="true" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getHeaderGroups().flatMap((headerGroup) =>
              headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted()
                return (
                  <DropdownMenuItem
                    key={header.id}
                    className="min-h-11 justify-between"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {isSorted ? (
                      isSorted === 'asc' ? (
                        <ArrowUp aria-label="Ascending" />
                      ) : (
                        <ArrowDown aria-label="Descending" />
                      )
                    ) : null}
                  </DropdownMenuItem>
                )
              }),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-5 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm text-foreground">
          <caption className="sr-only">Goal transactions</caption>
          <thead className="border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        isSorted === 'asc'
                          ? 'ascending'
                          : isSorted === 'desc'
                            ? 'descending'
                            : undefined
                      }
                      className={cn(
                        'px-4 text-sm font-medium text-muted-foreground',
                        (header.column.id === 'transactedOn' ||
                          header.column.id === 'createdBy') &&
                          'hidden sm:table-cell',
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={cn(
                            'flex min-h-11 w-full items-center gap-2 rounded-sm py-3 text-left hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                            header.column.id === 'amountCents' && 'justify-end',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {isSorted ? (
                            isSorted === 'asc' ? (
                              <ArrowUp
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <ArrowDown
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            )
                          ) : (
                            <ArrowUpDown
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'even:bg-white/3',
                    !readOnly &&
                      'cursor-pointer hover:bg-white/9 focus-within:bg-white/9',
                  )}
                  onClick={
                    readOnly
                      ? undefined
                      : () =>
                          router.push(
                            `/goals/${goalSlug}/transactions/${row.original.id}`,
                          )
                  }
                >
                  {row.getAllCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        'px-4 py-3 align-top',
                        cell.column.id === 'amountCents' &&
                          'text-right whitespace-nowrap tabular-nums',
                        cell.column.id === 'transactedOn' &&
                          'whitespace-nowrap',
                        (cell.column.id === 'transactedOn' ||
                          cell.column.id === 'createdBy') &&
                          'hidden sm:table-cell',
                      )}
                    >
                      {!readOnly && cell.column.id === 'description' ? (
                        <Link
                          href={`/goals/${goalSlug}/transactions/${row.original.id}`}
                          className="block rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Link>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                      {cell.column.id === 'description' ? (
                        <div className="mt-1 space-y-1 text-xs leading-relaxed text-muted-foreground sm:hidden">
                          <p>{formatLongDate(row.original.transactedOn)}</p>
                          <p>By {row.original.createdBy || '—'}</p>
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-left text-sm text-muted-foreground"
                >
                  {readOnly
                    ? 'No transactions yet.'
                    : 'No transactions yet. Add your first entry to start tracking.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
