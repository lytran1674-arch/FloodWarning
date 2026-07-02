// src/features/province_operator/components/ImportProvinceOperatorModal.tsx
import { useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import { useImportProvinceOperator } from "../hooks/useImportProvinceOperator";

interface ImportProvinceOperatorModalProps {
  open: boolean;
  onClose: () => void;
  onImported: () => void; // callback để refetch danh sách sau khi import thành công
}

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];

export function ImportProvinceOperatorModal({
  open,
  onClose,
  onImported,
}: ImportProvinceOperatorModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { importFile, loading, error, result, reset } =
    useImportProvinceOperator();

  if (!open) return null;

  const handleClose = () => {
    setSelectedFile(null);
    reset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      alert("Chỉ chấp nhận file .xlsx hoặc .xls");
      return;
    }

    setSelectedFile(file);
    reset();
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    const res = await importFile(selectedFile);
    if (res && res.code === 0) {
      onImported();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Import danh sách điều hành cấp tỉnh
          </h2>
          <button onClick={handleClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          File Excel cần có các cột: Số thứ tự, Họ tên, Giới tính, Ngày sinh,
          Số điện thoại, Email, Địa chỉ, Khu vực phụ trách.
        </p>

        {/* Vùng chọn file */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors"
        >
          {selectedFile ? (
            <>
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
              <p className="text-sm font-medium text-gray-700">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-500">
                Chọn file Excel (.xlsx, .xls)
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {error && (
          <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {result && result.code === 0 && (
          <div className="mt-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p>Import thành công.</p>
              {result.result?.successCount !== undefined && (
                <p className="text-xs mt-1">
                  Thành công: {result.result.successCount} dòng
                  {result.result.failCount
                    ? ` — Lỗi: ${result.result.failCount} dòng`
                    : ""}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded border px-4 py-2 text-sm text-gray-700"
          >
            Đóng
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile || loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Đang import..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}