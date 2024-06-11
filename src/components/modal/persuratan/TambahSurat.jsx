import { AiOutlineCloseSquare } from "react-icons/ai";
import { useState } from "react";
import FormatDate from "../../../utils/Date";
import { FaFile } from "react-icons/fa";
import {
  PostSuratMasuk,
  GetDetailSuratMasuk,
} from "../../../utils/FetchSuratMasuk";

const ModalTambahSurat = (props) => {
  const { modal, HandlerTambahSurat, setSurat } = props;
  const [letter_date, setLetterDate] = useState(FormatDate());
  const [received_date, setReceivedDate] = useState(FormatDate());
  const [loadingButton, setLoadingButton] = useState();

  if (!modal) {
    return null;
  }

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoadingButton(true);
    const formData = new FormData();
    formData.append("reference_number", e.target.reference_number.value);
    formData.append("letters_type", e.target.letters_type.value);
    formData.append("letter_date", letter_date);
    formData.append("received_date", received_date);
    formData.append("from", e.target.nama.value);
    formData.append("file", e.target.file.files[0]);
    formData.append("description", e.target.perihal.value);

    let { status, data } = await PostSuratMasuk(formData);
    if (status) {
      const response = await GetDetailSuratMasuk(data.letter.id);
      if (response.status) {
        setSurat((prev) => ({
          letter: [...prev.letter, response.data.letter],
          file: [...(prev.file || []), response.data.file],
        }));
      }
    }

    if (status === undefined) {
      status = false;
    }
    HandlerTambahSurat({ status });
    setLoadingButton(false);
  };

  return (
    <div className="modal fixed grid flex-col content-around bg-white rounded-lg drop-shadow-2xl z-30 inset-x-2/10 inset-y-1/10 px-8 font-poppins">
      <div className="modal-header flex justify-between items-center my-auto">
        <h3 className="font-extrabold text-xl text-custom">Tambah Surat</h3>
        <AiOutlineCloseSquare
          size={"1.5rem"}
          className="text-custom cursor-pointer"
          onClick={HandlerTambahSurat}
        />
      </div>
      <form onSubmit={HandlerSubmit}>
        <div className="modal-body grid grid-cols-2 gap-5 my-auto">
          <div className="tanggal grid gap-1">
            <label
              htmlFor="reference_number"
              className="text-custom text-base font-semibold"
            >
              Nomor Surat
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Masukkan Nomor Surat"
              id="reference_number"
              name="reference_number"
            />
          </div>
          <div className="tanggal grid gap-1">
            <label
              htmlFor="letters_date"
              className="text-custom text-base font-semibold"
            >
              Tanggal Surat
            </label>
            <input
              type="date"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              value={letter_date}
              id="letters_date"
              name="letters_date"
              onChange={(e) => setLetterDate(e.target.value)}
            />
          </div>
          <div className="tanggal grid gap-1">
            <label
              htmlFor="tanggal-diterima"
              className="text-custom text-base font-semibold"
            >
              Tanggal Diterima
            </label>
            <input
              type="date"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              value={received_date}
              id="tanggal-diterima"
              name="tanggal-diterima"
              onChange={(e) => setReceivedDate(e.target.value)}
            />
          </div>

          <div className="perihal grid gap-1">
            <label
              htmlFor="perihal"
              className="text-custom text-base font-semibold"
            >
              Perihal Surat
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Masukkan Perihal Surat"
              id="perihal"
              name="perihal"
            />
          </div>
          <div className="nama grid gap-1">
            <label
              htmlFor="nama"
              className="text-custom text-base font-semibold"
            >
              Nama Pengirim
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Masukkan Nama Pengirim"
              id="nama"
              name="nama"
            />
          </div>

          <div className="letters_type grid gap-1">
            <label
              htmlFor="letters_type"
              className="text-custom text-base font-semibold"
            >
              Jenis Surat
            </label>
            <select
              id="letters_type"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              name="letters_type"
            >
              <option className="font-normal" value="">
                Jenis Surat
              </option>
              <option className="font-normal" value="penting">
                Surat 1
              </option>
              <option className="font-normal" value="biasa">
                Surat 2
              </option>
              <option className="font-normal" value="tidak penting">
                Surat 3
              </option>
            </select>
          </div>

          <div className="file grid gap-1 relative">
            <label
              htmlFor="file"
              className="text-custom text-base font-semibold"
            >
              Lampiran
            </label>
            <div className="custom-input grid grid-flow-col outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg justify-between">
              <p>Pilih File</p>
              <FaFile className="mt-1" />
            </div>
            <input
              type="file"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg absolute top-5/10 opacity-0 -translate-y-1/4"
              id="file"
              name="file"
            />
          </div>
        </div>
        <div className="modal-footer flex justify-end gap-5 text-white font-semibold text-center my-auto">
          <button
            type="button"
            onClick={HandlerTambahSurat}
            className="items-center p-3 bg-red-500 rounded-lg "
          >
            Batal
          </button>
          <button
            type="submit"
            className={`items-center p-3 bg-secondary rounded-lg cursor-pointer ${
              loadingButton ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalTambahSurat;
