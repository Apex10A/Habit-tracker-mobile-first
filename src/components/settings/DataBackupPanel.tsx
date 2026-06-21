'use client';

import { useRef, useState } from 'react';
import { downloadBackup, importBackup, parseBackup } from '@/lib/backup';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

type DataBackupPanelProps = {
  userId: string;
  onImported: () => void;
};

export default function DataBackupPanel({ userId, onImported }: DataBackupPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<{ raw: string; count: number } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    downloadBackup(userId);
    setMessage({ type: 'success', text: 'Backup downloaded successfully.' });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = parseBackup(raw);

      if (!parsed.ok) {
        setMessage({ type: 'error', text: parsed.error });
        return;
      }

      setPendingImport({ raw, count: parsed.payload.habits.length });
    } catch {
      setMessage({ type: 'error', text: 'Could not read the selected file.' });
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;

    const result = importBackup(userId, pendingImport.raw);

    if (!result.ok) {
      setMessage({ type: 'error', text: result.error });
      setPendingImport(null);
      return;
    }

    setPendingImport(null);
    setMessage({
      type: 'success',
      text: `Imported ${result.importedCount} habit${result.importedCount === 1 ? '' : 's'}.`,
    });
    onImported();
  };

  return (
    <>
      <Card padding="md" data-testid="data-backup-panel">
        <h2 className="font-display text-xl font-bold text-foreground">Data & backup</h2>
        <p className="mt-2 text-secondary-text leading-relaxed">
          Export your habits to a JSON file before clearing browser data, or restore from a previous
          backup. Import replaces your current habits for this account.
        </p>

        {message ? (
          <p
            data-testid="backup-message"
            className={
              message.type === 'success'
                ? 'mt-4 rounded-xl bg-success-muted/50 px-4 py-3 text-sm text-success'
                : 'mt-4 rounded-xl bg-danger-muted px-4 py-3 text-sm text-danger'
            }
          >
            {message.text}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleExport}
            data-testid="export-backup-button"
            className="sm:flex-1"
          >
            Export backup
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            data-testid="import-backup-button"
            className="sm:flex-1"
          >
            Import backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            data-testid="import-backup-input"
            onChange={handleFileChange}
          />
        </div>
      </Card>

      {pendingImport ? (
        <Modal onClose={() => setPendingImport(null)}>
          <Card padding="md" className="shadow-xl" data-testid="import-backup-modal">
            <h3 className="font-display text-lg font-bold text-foreground">Replace current habits?</h3>
            <p className="mt-2 text-secondary-text">
              This will replace your current habits with {pendingImport.count} habit
              {pendingImport.count === 1 ? '' : 's'} from the backup file.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setPendingImport(null)}>
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={handleConfirmImport}
                data-testid="confirm-import-backup-button"
              >
                Import habits
              </Button>
            </div>
          </Card>
        </Modal>
      ) : null}
    </>
  );
}
