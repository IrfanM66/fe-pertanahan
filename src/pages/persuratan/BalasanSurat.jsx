import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import ModalEditBalasan from "../../components/modal/persuratan/EditBalasan";
import ModalDetailBalasan from "../../components/modal/persuratan/DetailBalasan";
import {
  GetBalasanSurat,
  GetDetailBalasan,
  DeleteBalasanSurat,
  GetSearchBalasanSurat
} from "../../utils/FetchBalasanSurat";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAuth from "../../hooks/UseAuth";
import { useSearchParams } from "react-router-dom";
import { ArrowCircleLeft, ArrowCircleRight } from "iconsax-react";

const hideActionKakan = ["Kepala Kantor"];

const BalasanSuratPage = () => {
  const auth = UseAuth();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [surat, setSurat] = useState([]);
  const [detailSurat, setDetailSurat] = useState({});
  const [edit, setEdit] = useState({});
  const [detail, setDetail] = useState({});
  const [modalDetail, setModalDetail] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDel, setModalDel] = useState(false);
  const [modalTambah, setModalTambah] = useState(false);
  const [tambah, setTambah] = useState(false);
  const [id, setId] = useState();
  let [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  const HandlerSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value) {
      GetSearchBalasanSurat(value)
        .then((res) => {
          setSearchResults(res.data.replyletter);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    GetBalasanSurat(page).then((res) => {
      setSurat(res.data);
      setLoading(true);
    });
  }, [page]);

  const HandlerDeleteBalasan = (id) => {
    Swal.fire({
      title: "Anda yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak dapat dipulihkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FB0017",
      cancelButtonColor: "#828282",
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteBalasanSurat(id).then((res) => {
          setSurat((prev) => {
            {
              return {
                ...prev,
                replyletter: prev.replyletter.filter((surat) => surat.id !== id)
              };
            }
          });
          Swal.fire({
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  };

  const HandlerEditBalasan = ({ id, status }) => {
    console.log("Status: ", status);
    if (id) {
      setId(id);
    }

    if (status) {
      setModalEdit((prev) => !prev);
      GetBalasanSurat(page).then((res) => {
        setSurat(res.data);
        setLoading(true);
      });
      toast.success("Surat Balasan berhasil diedit", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      GetBalasanSurat(page).then((res) => {
        setSurat(res.data);
        setLoading(true);
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
      setModalEdit((prev) => !prev);
    }
  };

  const HandlerDetailBalasan = (id) => {
    GetDetailBalasan(id).then((res) => {
      setDetail(res.data);
      setModalDetail((prev) => !prev);
    });
  };

  return (
    <main className="grid grid-cols-5 h-screen gap-8 bg-quinary font-poppins">
      <ModalEditBalasan
        modal={modalEdit}
        HandlerEditBalasan={HandlerEditBalasan}
        id={id}
        setSurat={setSurat}
      />
      <ModalDetailBalasan
        modal={modalDetail}
        HandlerDetailBalasan={HandlerDetailBalasan}
        surat={detail}
      />
      <Sidebar modal={modalDetail} modal2={modalTambah} modal3={modalEdit} />
      <div
        className={`content col-start-2 col-end-6 w-97/100 ${
          modalDetail || modalEdit || modalTambah ? "blur-sm" : null
        }`}
      >
        <div className="navbar pt-5">
          <h2 className="font-bold text-2xl">Balasan Surat</h2>
        </div>
        <div className="rekap mt-5 bg-white rounded-xl drop-shadow-custom p-6">
          <div className="search flex gap-4 justify-between">
            <div className="left w-1/3 flex relative">
              <input
                type="text"
                className="outline-none rounded-lg w-full outline-2 outline-quaternary  text-quaternary outline-offset-0 text-xs py-3 px-3 font-light italic"
                onChange={HandlerSearch}
                value={search}
                placeholder="Cari disini..."
              />
              <FaSearch className="absolute right-2 top-3 text-secondary" />
            </div>
          </div>
          <div className="tabel mt-7 sm:h-100 sm:overflow-y-auto lg:overflow-y-visible">
            <table className="table-auto w-full text-center text-sm font-normal font-sans">
              <thead className="text-white font-medium bg-secondary">
                <tr>
                  <th className="py-2">No</th>
                  <th className="py-2">Pengirim</th>
                  <th className="py-2">Keterangan</th>
                  <th className="py-2">Tanggal</th>
                  <th className="py-2">Aksi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!loading ? (
                  <tr>
                    <td colSpan="7" className="py-4">
                      Loading...
                    </td>
                  </tr>
                ) : (
                    (searchResults?.length > 0
                      ? searchResults
                      : surat?.replyletter || []) || []
                  ).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4">
                      Tidak ada surat yang dibalas.
                    </td>
                  </tr>
                ) : (
                  (
                    (searchResults?.length > 0
                      ? searchResults
                      : surat?.replyletter || []) || []
                  ).map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        (index + 1) % 2 == 0 ? "bg-quinary" : null
                      } `}
                    >
                      <td className="py-2.5 text-sm">
                        {index + 1 + (page - 1) * 10}
                      </td>
                      <td className="py-2.5 text-sm">{item.from}</td>
                      <td className="py-2.5 text-sm">
                        {item.note ? item.note.substring(0, 35) : ""}
                        {item?.note?.length > 35 ? "....." : ""}
                      </td>
                      <td className="py-2.5 text-sm">
                        {item.outgoing_letter_date}
                      </td>
                      <td className="py-2">
                        <div className="aksi flex justify-center gap-2">
                          {hideActionKakan.includes(auth?.type) ? null : (
                            <MdModeEdit
                              className="text-secondary cursor-pointer text-xl"
                              onClick={() =>
                                HandlerEditBalasan({ id: item.id })
                              }
                            />
                          )}
                          <IoMdEye
                            className="text-yellow-300 cursor-pointer text-xl"
                            onClick={() => HandlerDetailBalasan(item.id)}
                          />
                          {hideActionKakan.includes(auth?.type) ? null : (
                            <MdDeleteOutline
                              className="text-red-500 cursor-pointer text-xl"
                              onClick={() => HandlerDeleteBalasan(item.id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
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
                        surat &&
                        surat.replyletter &&
                        surat.replyletter.length < 10
                          ? "hidden"
                          : null
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

export default BalasanSuratPage;
