"use client";
import React from "react";

// ✅ Table wrapper
export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full border-collapse ${className}`}>
        {children}
      </table>
    </div>
  );
}

// ✅ Table Header section
export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`bg-gray-100 ${className}`}>
      {children}
    </thead>
  );
}

// ✅ Table Row
export function TableRow({ children, className = "" }) {
  return (
    <tr className={`border-b last:border-none ${className}`}>
      {children}
    </tr>
  );
}

// ✅ Table Head (header cell)
export function TableHead({ children, className = "" }) {
  return (
    <th
      className={`text-left text-sm font-medium text-gray-600 px-4 py-2 ${className}`}
    >
      {children}
    </th>
  );
}

// ✅ Table Body section
export function TableBody({ children, className = "" }) {
  return (
    <tbody className={className}>{children}</tbody>
  );
}

// ✅ Table Cell (normal cell)
export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-4 py-2 text-sm text-gray-700 ${className}`}>
      {children}
    </td>
  );
}
