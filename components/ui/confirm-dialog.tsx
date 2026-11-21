import { Modal } from './modal';
import { Button } from './button';

export function ConfirmDialog({
  onClose,
  onConfirm,
  pending = false,
}: {
  onClose: () => void;
  onConfirm: () => void;
  pending?: boolean;
}) {
  return (
    <Modal
      title='Удалить запись?'
      onClose={() => {
        if (!pending) onClose();
      }}
    >
      <p className='text-sm leading-relaxed text-slate-500'>
        Запись будет удалена из базы данных. Это действие нельзя отменить.
      </p>
      <div className='mt-7 flex justify-end gap-2.5 border-t border-slate-200 pt-5'>
        <Button disabled={pending} onClick={onClose}>
          Отмена
        </Button>
        <Button variant='danger' disabled={pending} onClick={onConfirm}>
          {pending ? 'Удаление…' : 'Удалить'}
        </Button>
      </div>
    </Modal>
  );
}
