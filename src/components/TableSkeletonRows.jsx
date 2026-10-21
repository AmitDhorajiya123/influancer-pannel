import React from 'react';

/** Shimmer placeholder rows shown inside a table while a paginated fetch is in flight. */
export default function TableSkeletonRows({ columns = 5, rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="skeleton-row">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c}>
              <span className="shimmer-bar" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
