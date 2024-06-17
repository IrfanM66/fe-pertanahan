import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import ModalDisposisi from "../../components/modal/ModalDisposisi";
import { GetDetailSuratMasuk } from "../../utils/FetchSuratMasuk";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAuth from "../../hooks/UseAuth";

const hideActionSeksi = [
  "Kasubag. TU",
  "Seksi Penetapan Hak & Pendaftaran",
  "Seksi Survei & Pemetaan",
  "Seksi Penataan & Pemberdayaan",
  "Seksi Pengadaan Tanah & Pengembangan",
  "Seksi Pengendalian & Penanganan Sengketa"
];

const DisposisiSuratPage = () => {
  const auth = UseAuth();
  let { id } = useParams();
  const [modal, setModal] = useState(false);
  const [disposisi, setDisposisi] = useState(null);

  useEffect(() => {
    GetDetailSuratMasuk(id).then((res) => {
      setDisposisi(res.data.letter);
    });
  }, [id]);

  const HandlerEditDisposisi = ({ status }) => {
    if (status) {
      setModal((prev) => !prev);
      toast.success("Surat berhasil di disposisi", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (status == false) {
      Swal.fire({
        title: "Gagal",
        text: "Lengkapi data yang kosong!",
        icon: "warning",
        iconColor: "#FB0017",
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      setModal((prev) => !prev);
    }
  };

  return (
    <main className="grid grid-cols-5 h-screen gap-8 bg-quinary font-sans">
      <ModalDisposisi
        modal={modal}
        HandlerEditDisposisi={HandlerEditDisposisi}
        surat={disposisi}
        setDisposisi={setDisposisi}
      />
      <Sidebar modal={modal} />
      <div
        className={`content col-start-2 col-end-6 w-97/100 ${
          modal ? "blur-sm" : null
        }`}
      >
        <ToastContainer />
        <div className="navbar pt-5">
          <h2 className="font-bold text-2xl">Disposisi Surat</h2>
        </div>
        <div className="rekap mt-8 bg-white h-5/6 rounded-xl drop-shadow-custom p-6">
          <div className="search flex gap-4 justify-end">
            <div className="right bg-secondary rounded-lg text-white grid justify-center content-center px-5">
              {hideActionSeksi.includes(auth?.type) ? null : (
                <div
                  className="grid grid-flow-col gap-2 items-center py-2 cursor-pointer"
                  onClick={HandlerEditDisposisi}
                >
                  <GoPlus size="1rem" />
                  <p>Disposisi</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 bg-quinary rounded-xl grid grid-flow-col grid-cols-2 py-4 px-6">
            <div className="left grid gap-3">
              <div className="tanggal">
                <p className="font-bold">Tanggal Disposisi</p>
                <h4 className="text-lg font-light pl-3">
                  {disposisi?.disposition_date || "-"}
                </h4>
              </div>
              <div className="disposisi">
                <p className="font-bold">Disposisi</p>
                <ul className="list-disc list-inside">
                  {disposisi?.disposition_process?.map((item, index) => (
                    <li className="text-lg font-light pl-3" key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="right">
              <div className="catatan">
                <p className="font-bold">Catatan</p>
                <h4 className="font-light pl-3">
                  {disposisi?.disposition_note}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DisposisiSuratPage;
