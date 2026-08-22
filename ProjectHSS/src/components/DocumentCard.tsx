import { FileText, Download } from 'lucide-react';
import type { DocumentItem } from '@/lib/types';
import { formatDate, formatFileSize } from '@/lib/format';
import { resolveDocumentPath } from '@/lib/queries';

export function DocumentCard({ doc }: { doc: DocumentItem }) {
  const url = resolveDocumentPath(doc.file_path);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover flex items-start gap-4 p-5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <FileText className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="chip bg-ink-100 text-ink-600">{doc.category}</span>
          {doc.featured && <span className="text-xs font-medium text-saffron-600">Featured</span>}
        </div>
        <h3 className="mt-2 truncate text-base font-semibold text-ink-900">{doc.title}</h3>
        {doc.description && <p className="mt-1 text-sm text-ink-500 line-clamp-2">{doc.description}</p>}
        <p className="mt-2 text-xs text-ink-400">
          {formatDate(doc.created_at)}
          {doc.file_size ? ` • ${formatFileSize(doc.file_size)}` : ''}
          {doc.file_type ? ` • ${doc.file_type}` : ''}
        </p>
      </div>
      <Download className="h-5 w-5 shrink-0 text-ink-400" />
    </a>
  );
}
