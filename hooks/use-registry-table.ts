'use client';
import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type VisibilityState,
  type PaginationState,
} from '@tanstack/react-table';
import type { Client, Section } from '@/types/crm';
import { getColumns } from '@/components/registry/table/columns';
import type { RegistryRecord } from '@/types/crm';
import { DEFAULT_PAGE_SIZE, SECTIONS } from '@/constants/registry';

export function useRegistryTable(section: Section, data: RegistryRecord[], clients: Client[]) {
  const columns = useMemo(() => getColumns(section, clients), [section, clients]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: SECTIONS[section].sortBy, desc: section === 'deals' },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const pageIndex = Math.min(
    pagination.pageIndex,
    Math.max(0, Math.ceil(data.length / pagination.pageSize) - 1),
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination: { ...pagination, pageIndex },
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => String(row.id),
    autoResetPageIndex: false,
    enableSortingRemoval: false,
  });
}
