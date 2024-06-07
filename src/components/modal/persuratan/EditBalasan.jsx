import { AiOutlineCloseSquare } from "react-icons/ai";
import { useEffect, useState } from "react";
import FormatDate from "../../../utils/Date";
import { FaFile } from "react-icons/fa";
import {
  PutBalasanSurat,
  GetDetailBalasan,
  GetBalasanSurat
} from "../../../utils/FetchBalasanSurat";
import { GetDetailSuratMasuk } from "../../../utils/FetchSuratMasuk";
const ModalEditBalasan = (props) => {
  const { modal, HandlerEditBalasan, id, setSurat } = props;
  const [letter_date, setLetterDate] = useState(FormatDate());
  const [letter_id, setLetterId] = useState(null);
  const [detailLetter, setDetailLetter] = useState({});
  const [status, setStatus] = useState(null);
  const [detail, setDetail] = useState(false);

  const [referenceNumber, setReferenceNumber] = useState(null);
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (id) {
      GetDetailBalasan(id).then((res) => {
        setDetailLetter(res.data);
        setReferenceNumber(res.data.replyletter[0].reference_number2);
        setNote(res.data.replyletter[0].note);
        setLetterDate(res.data.replyletter[0].outgoing_letter_date);
        setLetterId(res.data.replyletter[0].letter_id);
      });
      GetDetailSuratMasuk(letter_id).then((res) => {
        setDetail(res.data);
        setStatus(detail.letter.status);
      });
    }
  }, [id]);

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("reference_number2", referenceNumber);
    formData.append("outgoing_letter_date", letter_date);
    formData.append("note", note);
    formData.append("status", e.target.status.value);
    if (e.target.file.files[0]) {
      formData.append("file", e.target.file.files[0]);
    }
    const response = await PutBalasanSurat(id, formData);
    if (response.status) {
      HandlerEditBalasan({ status: response.status });
    } else {
      HandlerEditBalasan({ status: false });
    }
  };

  if (!modal) {
    return null;
  }

  return (
    <div className="modal bg-white fixed border-solid font-poppins rounded-lg drop-shadow-custom z-50 inset-x-2/10 inset-y-1/10 px-8 py-10 grid">
      <div className="header flex justify-between">
        <h3 className="font-extrabold text-xl text-custom">Edit Balasan</h3>
        <AiOutlineCloseSquare
          size={"1.5rem"}
          className="text-custom cursor-pointer"
          onClick={HandlerEditBalasan}
        />
      </div>
      <form onSubmit={HandlerSubmit} className="grid content-between">
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
              placeholder={
                referenceNumber ? referenceNumber : "Masukkan Nomor Surat"
              }
              id="reference_number2"
              name="reference_number2"
              // value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
          <div className="outgoing_letter_date grid gap-1 content-start">
            <label
              htmlFor="outgoing_letter_date"
              className="text-custom text-base font-semibold"
            >
              Tanggal Surat
            </label>
            <input
              type="date"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              value={letter_date}
              id="outgoing_letter_date"
              name="outgoing_letter_date"
              onChange={(e) => setLetterDate(e.target.value)}
            />
          </div>
          <div className="note grid gap-1 content-start">
            <label
              htmlFor="note"
              className="text-custom text-base font-semibold"
            >
              Keterangan
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Perihal surat..."
              id="note"
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              placeholder={status ? status : "Pilih Status Surat"}
            >
              <option className="font-normal" value="Pending">
                Pending
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
              id="file"
              name="file"
            />
          </div>
        </div>
        <div className="modal-footer flex justify-end gap-5 text-white font-semibold text-center my-auto">
          <div className="grid grid-flow-col gap-2 items-center py-1 px-5 bg-red-500 rounded-lg">
            <button type="button" onClick={HandlerEditBalasan}>
              Batal
            </button>
          </div>
          <div className="grid grid-flow-col gap-2 items-center py-1 px-5 bg-secondary rounded-lg">
            <button type="submit">Simpan</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModalEditBalasan;
