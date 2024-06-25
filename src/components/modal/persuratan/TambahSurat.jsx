import { AiOutlineCloseSquare } from "react-icons/ai";
import { useState } from "react";
import FormatDate from "../../../utils/Date";
import { FaFile } from "react-icons/fa";
import {
  PostSuratMasuk,
  GetDetailSuratMasuk
} from "../../../utils/FetchSuratMasuk";

const ModalTambahSurat = (props) => {
  const { modal, HandlerTambahSurat, setSurat } = props;
  const [letter_date, setLetterDate] = useState(FormatDate());
  const [received_date, setReceivedDate] = useState(FormatDate());
  const [loadingButton, setLoadingButton] = useState(false);
  const [letterType, setLetterType] = useState("Pengaduan");
  const [customLetterType, setCustomLetterType] = useState("");

  if (!modal) {
    return null;
  }

  const handleLetterTypeChange = (e) => {
    setLetterType(e.target.value);
  };

  const handleCustomLetterTypeChange = (e) => {
    setCustomLetterType(e.target.value);
  };

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoadingButton(true);

    const formData = new FormData();
    formData.append("reference_number", e.target.reference_number.value);
    formData.append(
      "letters_type",
      letterType === "Lainnya" ? customLetterType : letterType
    );
    formData.append("letter_date", letter_date);
    formData.append("received_date", received_date);
    formData.append("from", e.target.nama.value);
    formData.append("file", e.target.file.files[0]);
    formData.append("description", e.target.perihal.value);

    try {
      const { status, data } = await PostSuratMasuk(formData);

      if (status) {
        const response = await GetDetailSuratMasuk(data.letter.id);
        if (response.status) {
          setSurat((prev) => ({
            letter: [...prev?.letter, response.data.letter],
            file: [...(prev?.file || []), response.data.file]
          }));
        }
      }

      if (status === undefined) {
        throw new Error("Failed to fetch data");
      }

      HandlerTambahSurat({ status });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-3xl">
        <div className="flex justify-between items-center px-6 py-4">
          <h3 className="font-extrabold text-xl">Tambah Surat</h3>
          <AiOutlineCloseSquare
            size={"1.5rem"}
            className="cursor-pointer"
            onClick={HandlerTambahSurat}
          />
        </div>
        <form onSubmit={HandlerSubmit}>
          <div className="p-6 grid grid-cols-1 gap-4 xl:grid-cols-2 ">
            <div className="grid gap-1">
              <label
                htmlFor="reference_number"
                className="text-base font-semibold"
              >
                Nomor Surat
              </label>
              <input
                type="text"
                className="input-field border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Masukkan Nomor Surat"
                id="reference_number"
                name="reference_number"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="letters_date" className="text-base font-semibold">
                Tanggal Surat
              </label>
              <input
                type="date"
                className="input-field border border-gray-300 rounded-lg px-3 py-2"
                value={letter_date}
                id="letters_date"
                name="letters_date"
                onChange={(e) => setLetterDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label
                htmlFor="tanggal-diterima"
                className="text-base font-semibold"
              >
                Tanggal Diterima
              </label>
              <input
                type="date"
                className="input-field border border-gray-300 rounded-lg px-3 py-2"
                value={received_date}
                id="tanggal-diterima"
                name="tanggal-diterima"
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="perihal" className="text-base font-semibold">
                Perihal Surat
              </label>
              <input
                type="text"
                className="input-field border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Masukkan Perihal Surat"
                id="perihal"
                name="perihal"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="nama" className="text-base font-semibold">
                Nama Pengirim
              </label>
              <input
                type="text"
                className="input-field border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Masukkan Nama Pengirim"
                id="nama"
                name="nama"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="letters_type" className="text-base font-semibold">
                Jenis Surat
              </label>
              <select
                id="letters_type"
                className="input-field border border-gray-300 rounded-lg px-3 py-2"
                name="letters_type"
                value={letterType}
                onChange={handleLetterTypeChange}
              >
                <option value="Pengaduan">Pengaduan</option>
                <option value="Permintaan Data">Permintaan Data</option>
                <option value="Surat Sidang">Surat Sidang</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="grid gap-1 relative">
              <label htmlFor="file" className="text-base font-semibold">
                Lampiran
              </label>
              <div className="custom-input flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2">
                <p className="truncate">Pilih File</p>
                <FaFile className="mt-1" />
              </div>
              <input
                type="file"
                className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg absolute top-5/10 opacity-0 -translate-y-1/4"
                id="file"
                name="file"
              />
            </div>
            {letterType === "Lainnya" && (
              <div className="grid gap-1">
                <label
                  htmlFor="custom_letters_type"
                  className="text-base font-semibold"
                >
                  Jenis Surat Lainnya
                </label>
                <input
                  type="text"
                  id="custom_letters_type"
                  className="input-field border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Masukkan jenis surat"
                  value={customLetterType}
                  onChange={handleCustomLetterTypeChange}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end px-6 py-4">
            <button
              type="button"
              onClick={HandlerTambahSurat}
              className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`bg-secondary text-white py-2 px-4 rounded-lg ${
                loadingButton ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loadingButton}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahSurat;
