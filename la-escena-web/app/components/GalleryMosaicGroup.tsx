type Props<T> = {
  photos: T[]
  keyOf: (photo: T) => string
  renderCell: (photo: T, opts: { isBig: boolean }) => React.ReactNode
}

/**
 * Renders up to 8 photos as 2 rows of 4, alternating which side
 * holds the "big" (double-width) photo — left on row 1, right on row 2.
 * Falls back to a plain 2-col grid below the `sm` breakpoint.
 */
export default function GalleryMosaicGroup<T>({ photos, keyOf, renderCell }: Props<T>) {
  const row1 = photos.slice(0, 4)
  const row2 = photos.slice(4, 8)

  function renderRow(row: T[], bigIndex: number) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {row.map((photo, i) => (
          <div key={keyOf(photo)} className={i === bigIndex ? 'col-span-2 sm:col-span-2' : 'col-span-1'}>
            {renderCell(photo, { isBig: i === bigIndex })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {row1.length > 0 && renderRow(row1, 0)}
      {row2.length > 0 && renderRow(row2, row2.length - 1)}
    </div>
  )
}
