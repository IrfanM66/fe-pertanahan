import { AiOutlineCloseSquare } from "react-icons/ai";
import { useEffect, useState } from "react";
import FormatDate from "../../../utils/Date";
import { FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  PutBalasanSurat,
  GetDetailBalasan,
  GetBalasanSurat
} from "../../../utils/FetchBalasanSurat";
import { GetDetailSuratMasuk } from "../../../utils/FetchSuratMasuk";

const ModalEditBalasan = (props) => {
  const { modal, HandlerEditBalasan, id, surat, setSurat } = props;
  const [referenceNumber2, setReferenceNumber2] = useState("");
  const [outgoingLetterDate, setOutgoingLetterDate] = useState(FormatDate());
  const [note, setNote] = useState("");
  const [from, setFrom] = useState("");
  const [status, setStatus] = useState("");
  const [referenceLetter, setReferenceLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [nomor, setNomor] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (surat?.replyletter && surat.replyletter.length > 0) {
          setLoading(true);
          const detailRes = await GetDetailSuratMasuk(
            surat.replyletter[0].letter_id
          );

          const detailLetterData = detailRes.data;
          setStatus(detailLetterData.letter.status);
          setReferenceLetter(
            `${detailLetterData.letter.from} ${detailLetterData.letter.letter_date}`
          );
          setLoading(false);
        } else {
          console.error("Error fetching data", error);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [id, surat]);

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("reference_number2", referenceNumber2);
    formData.append("status", status);
    formData.append("outgoing_letter_date", outgoingLetterDate);
    formData.append("note", note);
    formData.append("from", from);

    if (e.target.file.files[0]) {
      formData.append("file", e.target.file.files[0]);
    }

    try {
      const response = await PutBalasanSurat(nomor, formData);
      if (response.status === true) {
        HandlerEditBalasan({ status: true });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Surat gagal diedit",
          icon: "warning",
          iconColor: "#FB0017",
          showConfirmButton: false,
          timer: 1000
        });
      }
    } catch (error) {
      console.error("Error updating surat:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat mengupdate surat",
        icon: "error",
        iconColor: "#FB0017",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  useEffect(() => {
    if (surat?.replyletter?.length > 0) {
      const replyLetter = surat.replyletter[0];
      setOutgoingLetterDate(replyLetter.outgoing_letter_date || "");
      setNote(replyLetter.note || "");
      setReferenceNumber2(replyLetter.reference_number2 || "");
      setFrom(replyLetter.from || "");
      setStatus(replyLetter.status || "");
      setNomor(replyLetter.id || "");
    }
  }, [surat]);

  if (!modal || !surat) {
    return null;
  }

  return (
    <div className="modal fixed grid flex-col content-around bg-white rounded-lg drop-shadow-2xl z-30 inset-x-2/10 inset-y-1/10 px-8 font-poppins">
      <div className="modal-header flex justify-between items-center my-auto">
        <h3 className="font-extrabold text-xl text-custom">
          Edit Surat Balasan
        </h3>
        <AiOutlineCloseSquare
          size={"1.5rem"}
          className="text-custom cursor-pointer"
          onClick={HandlerEditBalasan}
        />
      </div>
      <form onSubmit={HandlerSubmit}>
        <div className="modal-body grid grid-cols-2 gap-5 my-auto">
          <div className="tanggal grid gap-1">
            <label
              htmlFor="reference_number2"
              className="text-custom text-base font-semibold"
            >
              Nomor Surat
            </label>

            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder={
                referenceNumber2 ? referenceNumber2 : "Masukkan Nomor Surat"
              }
              id="reference_number2"
              name="reference_number2"
              value={referenceNumber2}
              onChange={(e) => setReferenceNumber2(e.target.value)}
            />
          </div>

          <div className="tanggal grid gap-1">
            <label
              htmlFor="outgoing_letter_date"
              className="text-custom text-base font-semibold"
            >
              Tanggal Surat
            </label>
            <input
              type="date"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              value={outgoingLetterDate}
              id="outgoing_letter_date"
              name="outgoing_letter_date"
              onChange={(e) => setOutgoingLetterDate(e.target.value)}
            />
          </div>
          <div className="nama grid gap-1">
            <label
              htmlFor="from"
              className="text-custom text-base font-semibold"
            >
              Nama Pengirim
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Masukkan Nama Pengirim"
              id="from"
              name="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="perihal grid gap-1">
            <label
              htmlFor="note"
              className="text-custom text-base font-semibold"
            >
              Catatan Surat
            </label>
            <input
              type="text"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              placeholder="Masukkan Catatan Surat"
              id="note"
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="status grid gap-1">
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
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option className="font-normal" value="Pending">
                Pending
              </option>
              <option className="font-normal" value="Selesai">
                Selesai
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
          <div className="lampiran grid gap-1 relative content-start">
            <label
              htmlFor="lampiran"
              className="text-custom text-base font-semibold"
              style={{ marginBottom: "0.5rem" }} // Menambahkan margin bawah
            >
              Balasan dari Surat
            </label>
            <Link
              to={`/surat-masuk?id=${surat?.replyletter[0].letter_id}`}
              key={surat?.replyletter[0].letter_id}
            >
              <div
                type="text"
                className="outline-none border-none border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              >
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <p>{referenceLetter ? referenceLetter : "Loading"}</p>
                )}
              </div>
            </Link>
          </div>
        </div>
        <div className="modal-footer flex justify-end gap-5 text-white font-semibold text-center my-auto">
          <button
            type="button"
            onClick={HandlerEditBalasan}
            className="items-center p-3 bg-red-500 rounded-lg "
          >
            Batal
          </button>
          <button
            type="submit"
            className="items-center p-3 bg-secondary rounded-lg "
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalEditBalasan;
