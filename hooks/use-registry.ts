'use client';
import { useEffect, useMemo, useState } from 'react';
import type {
  Section,
  RegistryRecord,
  RecordFormState,
  RegistryFilters,
  Client,
  Deal,
  FormError,
} from '@/types/crm';
import { INITIAL_FILTERS, SECTIONS } from '@/constants/registry';
import { ApiError, loadRegistry, persistRecord, removeRecord } from '@/lib/api/registry';
import { filterRecords, validateRecord } from '@/lib/registry';
import { useRegistryTable } from './use-registry-table';

export function useRegistry() {
  const [section, setSection] = useState<Section>('deals');
  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [form, setForm] = useState<RecordFormState | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingPending, setDeletingPending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    loadRegistry(controller.signal)
      .then((data) => {
        setClients(data.clients);
        setDeals(data.deals);
        setLoadError('');
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  function retry() {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  const source = section === 'deals' ? deals : clients;
  const filtered = useMemo(() => filterRecords(source, filters), [source, filters]);
  const table = useRegistryTable(section, filtered, clients);

  function changeSection(next: Section) {
    setSection(next);
    setFilters(INITIAL_FILTERS);
    setNotice('');
    table.setPageIndex(0);
    table.setColumnVisibility({ id: false });
    table.setSorting([{ id: SECTIONS[next].sortBy, desc: next === 'deals' }]);
  }

  function changeFilters(next: RegistryFilters) {
    setFilters(next);
    table.setPageIndex(0);
  }

  function open(id: number, readOnly: boolean) {
    setForm({ record: source.find((r) => r.id === id), readOnly });
  }

  async function save(record: RegistryRecord): Promise<FormError | undefined> {
    const error = validateRecord(record, clients, deals);

    if (error) return error;

    try {
      const saved = await persistRecord(section, record, Boolean(form?.record));
      if ('code' in saved)
        setClients((prev) =>
          prev.some((c) => c.id === saved.id)
            ? prev.map((c) => (c.id === saved.id ? saved : c))
            : [...prev, saved],
        );
      else
        setDeals((prev) =>
          prev.some((d) => d.id === saved.id)
            ? prev.map((d) => (d.id === saved.id ? saved : d))
            : [saved, ...prev],
        );
      setForm(null);
      setNotice('Запись сохранена.');
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : 'Не удалось сохранить запись.',
        fieldErrors: error instanceof ApiError ? error.fieldErrors : undefined,
      };
    }
  }

  async function remove() {
    if (deleting === null || deletingPending) return;
    setDeletingPending(true);
    try {
      await removeRecord(section, deleting);
      if (section === 'clients') setClients((prev) => prev.filter((c) => c.id !== deleting));
      else setDeals((prev) => prev.filter((d) => d.id !== deleting));
      setNotice('Запись удалена.');
      setDeleting(null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Не удалось удалить запись.');
      setDeleting(null);
    } finally {
      setDeletingPending(false);
    }
  }

  return {
    loading,
    loadError,
    retry,
    deletingPending,
    section,
    clients,
    deals,
    filters,
    form,
    setForm,
    deleting,
    setDeleting,
    notice,
    setNotice,
    source,
    filtered,
    table,
    changeSection,
    changeFilters,
    open,
    save,
    remove,
  };
}
