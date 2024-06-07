import { AiOutlineCloseSquare } from "react-icons/ai";
import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { PutSuratMasuk } from "../../../utils/FetchSuratMasuk";
import Swal from "sweetalert2";

const ModalEditSurat = (props) => {
  const { modal, HandlerEditSurat, surat, setSurat } = props;
  const [no, setNo] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [letter_date, setLetterDate] = useState(null);
  const [received_date, setReceivedDate] = useState(null);
  const [letters_type, setLettersType] = useState(null);

  const HandlerSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("reference_number", no);
    formData.append("letters_type", letters_type);
    formData.append("letter_date", letter_date);
    formData.append("received_date", received_date);
    formData.append("from", name);
    formData.append("description", description);

    if (event.target.file.files[0]) {
      formData.append("file", event.target.file.files[0]);
    }

    try {
      const response = await PutSuratMasuk(formData, surat?.letter?.id);
      if (response.status === true) {
        setSurat((prev) => {
          const letters = prev?.letter || [];
          const files = prev?.file || [];

          const newState = letters.map((data, index) => {
            if (data.id == surat.letter.id) {
              return {
                letter: { ...data, ...response.data.letter },
                file: { ...files[index], ...response.data.file }
              };
            }
            return {
              letter: { ...data },
              file: files[index]
            };
          });

          return {
            letter: newState.map((data) => data.letter),
            file: newState.map((data) => data.file)
          };
        });
        HandlerEditSurat({ status: true });
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
    setLetterDate(surat?.letter?.letter_date);
    setReceivedDate(surat?.letter?.received_date);
    setNo(surat?.letter?.id);
    setName(surat?.letter?.from);
    setDescription(surat?.letter?.description);
    setLettersType(surat?.letter?.letters_type);
  }, [surat]);

  if (!modal || !surat) {
    return null;
  }

  return (
    <div className="modal fixed grid flex-col content-around bg-white rounded-lg drop-shadow-2xl z-30 inset-x-2/10 inset-y-1/10 px-8 font-poppins">
      <div className="modal-header flex justify-between items-center my-auto">
        <h3 className="font-extrabold text-xl text-custom">Edit Surat</h3>
        <AiOutlineCloseSquare
          size={"1.5rem"}
          className="text-custom cursor-pointer"
          onClick={HandlerEditSurat}
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
              placeholder={no ? no : "Masukkan Nomor Surat"}
              id="reference_number"
              name="reference_number"
              // value={no}
              onChange={(e) => setNo(e.target.value)}
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
              htmlFor="received_date"
              className="text-custom text-base font-semibold"
            >
              Tanggal Diterima
            </label>
            <input
              type="date"
              className="outline-none border-2 border-quaternary w-full py-2.5 px-3 text-sm text-custom rounded-lg"
              value={received_date}
              id="received_date"
              name="received_date"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              required
              placeholder={letters_type}
            >
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
            onClick={HandlerEditSurat}
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

export default ModalEditSurat;
