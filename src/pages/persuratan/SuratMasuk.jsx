import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import ModalTambahSurat from "../../components/modal/persuratan/TambahSurat";
import ModalEditSurat from "../../components/modal/persuratan/EditSurat";
import ModalDetailSurat from "../../components/modal/persuratan/DetailSurat";
import {
  GetSuratMasuk,
  GetDetailSuratMasuk,
  DeleteSuratMasuk,
  GetSearchSuratMasuk,
} from "../../utils/FetchSuratMasuk";
import ModalTambahBalasan from "../../components/modal/persuratan/TambahBalasan";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsReplyAll } from "react-icons/bs";
import UseAuth from "../../hooks/UseAuth";
import { useSearchParams } from "react-router-dom";
import { ArrowCircleLeft, ArrowCircleRight } from "iconsax-react";
import Spinner from "../../components/spinners/Spinner";

const hideActionKakan = ["Kepala Kantor"];
const hideActionSeksi = [
  "Kasubag. TU",
  "Seksi Penetapan Hak & Pendaftaran",
  "Seksi Survei & Pemetaan",
  "Seksi Penataan & Pemberdayaan",
  "Seksi Pengadaan Tanah & Pengembangan",
  "Seksi Pengendalian & Penanganan Sengketa",
];

const SuratMasukPage = () => {
  const auth = UseAuth();
  let [searchParams, setSearchParams] = useSearchParams();
  const idNotif = searchParams.get("id");
  const idbalas = searchParams.get("id");
  const page = searchParams.get("page") || 1;
  const [lastpage, setLastPage] = useState([]) || ["last_page=1"];
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [surat, setSurat] = useState([]);
  const [detail, setDetail] = useState(false);
  const [tambah, setTambah] = useState(false);
  const [id, setId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [overdueAlerts, setOverdueAlerts] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingedit, setLoadingEdit] = useState(false);
  const [loadingeDetail, setLoadingDetail] = useState(false);

  const HandlerSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value) {
      GetSearchSuratMasuk(value)
        .then((res) => {
          setSearchResults(res.data.letter);
          setLastPage(res.pagination.last_page);
          setLoading(true);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
          setLoading(true);
        });
    } else {
      GetSuratMasuk(page)
        .then((res) => {
          setSurat(res.data);
          setLastPage(res.pagination.last_page);
          setSearchResults([]);
          setLoading(true);
        })
        .catch((error) => {
          console.error("Error fetching surat masuk:", error);
          setSurat([]);
          setLoading(true);
        });
    }

    setLoading(false);
  };

  useEffect(() => {
    GetSuratMasuk(page)
      .then((res) => {
        setSurat(res.data);
        setLastPage(res.pagination.last_page);

        setLoading(true);
      })
      .catch((error) => console.error("Error fetching surat masuk:", error));

    const intervalId = setInterval(() => {
      GetSuratMasuk(page).then((res) => {
        setSurat(res.data);
        setLoading(true);
      });
    }, 3000);
    setLoading(false);
    console.log("surat:", surat);
    console.log("last page:", lastpage);
    return () => clearInterval(intervalId);
  }, [page]);

  useEffect(() => {
    if (idNotif) {
      GetDetailSuratMasuk(idNotif).then((res) => {
        setDetail(res.data);
        setModal3(true);
      });
    }
  }, [idNotif]);
  useEffect(() => {
    if (idbalas) {
      GetDetailSuratMasuk(idbalas).then((res) => {
        setDetail(res.data);
        setModal3(true);
      });
    }
  }, [idbalas]);
  useEffect(() => {
    const overdueLetters =
      surat.letter
        ?.filter((item) => {
          const isDateExceeded = checkDateExceeded(item.letter_date);
          return isDateExceeded && item.status !== "Selesai";
        })
        .map((item) => `Surat dari ${item.from} (${item.letter_date})`) || [];

    setOverdueAlerts(overdueLetters);

    if (initialLoad && overdueLetters.length > 0) {
      overdueLetters.forEach((overdueMessage) => {
        toast.error(`${overdueMessage} belum ditangani !`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
      setInitialLoad(false);
    }
  }, [surat]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if ((modal2 || modal3) && !event.target.closest(".modal")) {
        setModal2(false);
        setModal3(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [modal2, modal3]);

  const HandlerDeleteSurat = (id) => {
    Swal.fire({
      title: "Anda yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak dapat dipulihkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#828282",
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteSuratMasuk(id).then((res) => {
          setSurat((prev) => {
            const updatedLetter = prev.letter
              ? prev.letter.filter((surat) => surat.id !== id)
              : [];

            const updatedFile = prev.file
              ? prev.file.filter((surat) => surat.id !== id)
              : [];
            return {
              ...prev,
              letter: updatedLetter,
              file: updatedFile,
            };
          });
          Swal.fire({
            title: "Berhasil!",
            text: "Data berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
    });
  };

  const HandlerTambahSurat = ({ status }) => {
    if (status) {
      GetSuratMasuk(page).then((res) => {
        setSurat(res.data);
        setLoading(true);
      });
      setModal(false);
      toast.success("Surat berhasil ditambah", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (status == false) {
      Swal.fire({
        title: "Gagal",
        text: "Lengkapi data yang kosong!",
        icon: "warning",
        iconColor: "#FB0017",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      setModal(!modal);
    }
  };

  const HandlerEditSurat = ({ id, status }) => {
    setLoadingEdit(true);
    if (status) {
      toast.success("Surat berhasil diedit", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (id) {
      GetDetailSuratMasuk(id)
        .then((res) => {
          setDetail(res.data);
          setModal2(!modal2);
        })
        .finally(() => setLoadingEdit(false));
    } else {
      setModal2(!modal2);
    }
    setLoadingEdit(false);
  };

  const HandlerDetailSurat = (id) => {
    setLoadingDetail(true);

    GetDetailSuratMasuk(id)
      .then((res) => {
        setDetail(res.data);
        setModal3(!modal3);
      })
      .finally(() => setLoadingDetail(false));
  };

  const HandlerTambahBalasan = ({ id, status }) => {
    if (id) {
      setId(id);
    }
    if (status) {
      setTambah(false);
      toast.success("Surat berhasil dibalas", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (status == false) {
      Swal.fire({
        title: "Gagal",
        text: "Lengkapi data yang kosong!",
        icon: "warning",
        iconColor: "#FB0017",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      setTambah(!tambah);
    }
    GetSuratMasuk(page).then((res) => {
      setSurat(res.data);
      setLoading(true);
    });
  };
  const checkDateExceeded = (date) => {
    const currentDate = new Date();
    const letterDate = new Date(date);
    const differenceInDays = (currentDate - letterDate) / (1000 * 3600 * 24);
    return differenceInDays > 3;
  };

  return (
    <main className="grid grid-cols-5 h-screen gap-8 bg-quinary font-poppins">
      <ModalTambahSurat
        modal={modal}
        HandlerTambahSurat={HandlerTambahSurat}
        setSurat={setSurat}
        id={id}
      />
      <ModalEditSurat
        modal={modal2}
        HandlerEditSurat={HandlerEditSurat}
        surat={detail}
        setSurat={setSurat}
      />
      <ModalDetailSurat
        modal={modal3}
        HandlerDetailSurat={HandlerDetailSurat}
        surat={detail}
      />
      <ModalTambahBalasan
        modal={tambah}
        HandlerTambahBalasan={HandlerTambahBalasan}
        id={id}
      />
      <Sidebar modal={modal} modal2={modal2} modal3={modal3} />
      <div
        className={`content col-start-2 col-end-6 w-97/100 ${
          tambah || modal || modal2 || modal3 ? "blur-sm z-auto" : ""
        }`}
      >
        <div className="navbar pt-5">
          <h2 className="font-bold text-2xl">Surat Masuk </h2>
        </div>
        <div className="rekap mt-5 bg-white rounded-xl drop-shadow-custom p-6">
          <div className="search flex gap-4 justify-between">
            <div className="left w-1/3 flex relative">
              <input
                type="text"
                className="outline-none rounded-lg w-full outline-2 outline-quaternary text-quaternary outline-offset-0 text-xs py-3 px-3 font-light italic"
                onChange={HandlerSearch}
                value={search}
                placeholder="Cari disini..."
              />
              <FaSearch className="absolute right-2 top-3 text-secondary" />
            </div>
            {hideActionKakan.includes(auth?.type) ||
            hideActionSeksi.includes(auth?.type) ? null : (
              <div
                className="right bg-secondary rounded-lg text-white grid justify-center content-center px-5 cursor-pointer"
                onClick={HandlerTambahSurat}
              >
                <div className="grid grid-flow-col gap-2 text-sm items-center py-2">
                  <GoPlus size="1rem" />
                  <button>Tambah Surat</button>
                </div>
              </div>
            )}
          </div>
          <div className="tabel mt-7 sm:h-100 sm:overflow-y-auto lg:overflow-y-visible mb-4">
            <table className="table-auto w-full text-center text-sm font-normal font-poppins">
              <thead className="text-white bg-secondary">
                <tr>
                  <th className="py-2">No</th>
                  <th className="py-2">Pengirim</th>
                  <th className="py-2">Jenis Surat</th>
                  <th className="py-2">Tanggal</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Aksi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!loading ? (
                  <tr>
                    <td colSpan="6">
                      <div className="flex justify-center items-center">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : (
                    (searchResults?.length > 0
                      ? searchResults
                      : surat?.letter || []) || []
                  ).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4">
                      Tidak ada surat yang masuk.
                    </td>
                  </tr>
                ) : (
                  (
                    (searchResults?.length > 0
                      ? searchResults
                      : surat?.letter || []) || []
                  ).map((item, index) => {
                    const isDateExceeded = checkDateExceeded(item.letter_date);
                    return (
                      <tr
                        key={index}
                        className={`${
                          isDateExceeded && item.status == "Pending"
                            ? "bg-red-200"
                            : (index + 1) % 2 === 0
                            ? "bg-quinary"
                            : ""
                        }`}
                      >
                        <td className="py-2 text-sm ">
                          {index + 1 + (page - 1) * 10}
                        </td>
                        <td className="py-2 text-sm">{item.from}</td>
                        <td className="py-2 text-sm">{item.letters_type}</td>
                        <td className="py-2 text-sm">{item.letter_date}</td>
                        <td className="py-2 text-sm">
                          <p
                            className={`${
                              item.status !== "Pending"
                                ? "bg-green-200 text-green-500"
                                : "bg-red-300 text-red-600"
                            } rounded-lg py-1 text-s`}
                          >
                            {item.status}
                          </p>
                        </td>
                        <td className="py-2">
                          <div className="aksi flex justify-center gap-2">
                            {hideActionKakan.includes(auth?.type) ||
                            hideActionSeksi.includes(auth?.type) ? null : (
                              <MdModeEdit
                                className={`text-secondary cursor-pointer text-xl ${
                                  loadingedit
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                                type="button"
                                onClick={() =>
                                  HandlerEditSurat({ id: item.id })
                                }
                              />
                            )}
                            <IoMdEye
                              className={`text-yellow-300 cursor-pointer text-xl ${
                                loadingeDetail
                                  ? "opacity-50 pointer-events-none"
                                  : ""
                              }`}
                              type="button"
                              onClick={() => HandlerDetailSurat(item.id)}
                            />
                            {hideActionKakan.includes(auth?.type) ||
                            hideActionSeksi.includes(auth?.type) ? null : (
                              <MdDeleteOutline
                                className="text-red-500 cursor-pointer text-xl"
                                type="button"
                                onClick={() => HandlerDeleteSurat(item.id)}
                              />
                            )}
                            <Link to={`/surat-masuk/daftar-balasan/${item.id}`}>
                              <BsReplyAll
                                className="text-red-500 cursor-pointer text-xl"
                                type="button"
                              />
                            </Link>
                          </div>
                        </td>
                        <td>
                          <div className="w-auto flex space-x-4">
                            {!hideActionKakan.includes(auth?.type) && (
                              <div
                                onClick={() =>
                                  HandlerTambahBalasan({ id: item.id })
                                }
                                className="bg-secondary rounded-xl text-white flex items-center justify-center flex-grow"
                              >
                                <button className="font-medium py-1 px-2 w-full">
                                  Tambah Balasan
                                </button>
                              </div>
                            )}
                            {!hideActionSeksi.includes(auth?.type) && (
                              <Link
                                to={`/surat-masuk/disposisi-surat/${item.id}`}
                                className="flex-grow"
                              >
                                <div className="bg-secondary rounded-xl text-white flex items-center justify-center w-full flex-grow">
                                  <button className="font-medium py-1 px-2 w-full">
                                    Disposisi Surat
                                  </button>
                                </div>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center pt-3 justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan{" "}
                  <span className="font-medium">10 Data Surat per Tabel</span>
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md gap-3"
                  aria-label="Pagination"
                >
                  <a href="#" className="relative inline-flex items-center">
                    <span className="sr-only">Previous</span>
                    <ArrowCircleLeft
                      className={`${
                        page == 1 ? "hidden" : ""
                      } h-7 w-7 text-quaternary`}
                      aria-hidden="true"
                      onClick={() =>
                        setSearchParams({ page: parseInt(page) - 1 })
                      }
                    />
                  </a>
                  <a href="#" className="relative inline-flex items-center  ">
                    <span className="sr-only">Next</span>
                    <ArrowCircleRight
                      className={`${
                        surat?.letter?.length < 10 || lastpage === 1
                          ? "hidden"
                          : ""
                      } h-7 w-7 text-quaternary`}
                      aria-hidden="true"
                      onClick={() =>
                        setSearchParams({ page: parseInt(page) + 1 })
                      }
                    />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </main>
  );
};

export default SuratMasukPage;
