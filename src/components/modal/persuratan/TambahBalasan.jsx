import { AiOutlineCloseSquare } from "react-icons/ai";
import { useState } from "react";
import FormatDate from "../../../utils/Date";
import { FaFile } from "react-icons/fa";
import { PostBalasanSurat } from "../../../utils/FetchBalasanSurat";

const ModalTambahBalasan = (props) => {
  const { modal, HandlerTambahBalasan, id } = props;
  const [letter_date, setLetterDate] = useState(FormatDate());
  const [loadingButton, setLoadingButton] = useState();

  const HandleTambahBalasan = async (e) => {
    e.preventDefault();
    setLoadingButton(true);
    let formData = new FormData();
    formData.append("reference_number2", e.target.nomor.value);
    formData.append("status", e.target.status.value);
    formData.append("outgoing_letter_date", letter_date);
    formData.append("file", e.target.lampiran.files[0]);
    formData.append("note", e.target.keterangan.value);
    const response = await PostBalasanSurat(id, formData);

    if (response.status) {
      HandlerTambahBalasan({ status: response.status });
      setLoadingButton(false);
    } else {
      HandlerTambahBalasan({ status: response.status });
      setLoadingButton(false);
    }
  };

  if (!modal) {
    return null;
  }

  return (
    <div className="modal bg-white fixed border-solid font-poppins rounded-lg drop-shadow-custom z-50 inset-x-2/10 inset-y-1/10 px-8 py-10 grid">
      <div className="header flex justify-between">
        <h3 className="font-extrabold text-xl text-custom">Tambah Balasan</h3>
        <AiOutlineCloseSquare
          size={"1.5rem"}
          className="text-custom cursor-pointer"
          onClick={HandlerTambahBalasan}
        />
      </div>
      <form onSubmit={HandleTambahBalasan} className="grid content-between">
        <div className="modal-body grid grid-cols-2 gap-5 my-auto ">
          <div className="tanggal grid gap-1 content-start">
            <label
              htmlFor="nomor"
              className="text-custom text-base font-semibold"
            >
              Nomor Surat
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Nomor surat..."
              id="nomor"
              name="nomor"
            />
          </div>
          <div className="tanggal grid gap-1 content-start">
            <label
              htmlFor="tanggal"
              className="text-custom text-base font-semibold"
            >
              Tanggal Surat
            </label>
            <input
              type="date"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              value={letter_date}
              id="tanggal"
              name="tanggal"
              onChange={(e) => setLetterDate(e.target.value)}
            />
          </div>
          <div className="keterangan grid gap-1">
            <label
              htmlFor="keterangan"
              className="text-custom text-base font-semibold"
            >
              Keterangan
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Keterangan..."
              id="keterangan"
              name="keterangan"
            />
          </div>
          <div className="status grid gap-1 content-start">
            <label
              htmlFor="status"
              className="text-custom text-base font-semibold"
            >
              Status Surat
            </label>
            <select
              id="status"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              name="status"
            >
              <option className="font-normal" value="Pending">
                Pilih Status Surat
              </option>
              <option className="font-normal" value="Proses">
                Proses
              </option>
              <option className="font-normal" value="Selesai">
                Selesai
              </option>
            </select>
          </div>
          <div className="lampiran grid gap-1 relative content-start">
            <label
              htmlFor="lampiran"
              className="text-custom text-base font-semibold"
            >
              Lampiran
            </label>
            <div className="custom-input grid grid-flow-col outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg justify-between">
              <p>Pilih File</p>
              <FaFile />
            </div>
            <input
              type="file"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg absolute top-5/10 opacity-0 -translate-y-1/4"
              id="lampiran"
              name="lampiran"
            />
          </div>
        </div>
        <div className="modal-footer flex justify-end gap-5 text-white font-semibold text-center my-auto">
          <button
            className="grid grid-flow-col gap-2 items-center py-1 px-5 bg-red-500 rounded-lg"
            type="button"
            onClick={HandlerTambahBalasan}
          >
            Batal
          </button>
          <button
            className={`grid grid-flow-col gap-2 items-center py-1 px-5 bg-secondary rounded-lg ${
              loadingButton ? "opacity-50 pointer-events-none" : ""
            }`}
            type="submit"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalTambahBalasan;
