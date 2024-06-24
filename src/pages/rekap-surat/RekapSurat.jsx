import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import FormatDate from "../../utils/Date";
import { FaFile, FaSearch } from "react-icons/fa";
import UseAuth from "../../hooks/UseAuth";
import {
  GetRekapSurat,
  getShowFileRekap,
  GetCategoriesRekapSurat
} from "../../utils/FetchRekapSurat";
import { useSearchParams } from "react-router-dom";
import { ArrowCircleLeft, ArrowCircleRight } from "iconsax-react";
import { CgClose } from "react-icons/cg";
import Spinner from "../../components/spinners/Spinner";

const RekapSuratPage = () => {
  const auth = UseAuth();
  const [kategori, setKategori] = useState("Kategori Surat");
  const [tanggal, setTanggal] = useState("");
  const [surat, setSurat] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  let [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [lastpage, setLastPage] = useState(1);
  const [banyaksurat, setBanyakSurat] = useState("");
  const page = searchParams.get("page") || 1;
  const currentKategori = searchParams.get("kategori") || kategori;
  const currentTanggal = searchParams.get("tanggal") || tanggal;

  const Handlerkategori = (e) => {
    setKategori(e.target.value);
  };

  const HandlerTanggal = (e) => {
    setTanggal(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    if (currentKategori === "Kategori Surat" && !currentTanggal) {
      GetRekapSurat(page).then((res) => {
        setSurat(res.data);
        setLastPage(res.pagination.last_page);
        setBanyakSurat(res.data.letter.length);
        setLoading(false);
      });
    } else {
      GetCategoriesRekapSurat(page, currentKategori, currentTanggal).then(
        (res) => {
          if (res.data.letter.length === 0) {
            GetRekapSurat(page).then((res) => {
              setSurat(res.data);
              setLastPage(res.pagination.last_page);
              setBanyakSurat(res.data.letter.length);
              setLoading(false);
            });
          } else {
            setSurat(res.data);
            setLastPage(res.pagination.last_page);
            setBanyakSurat(res.data.letter.length);
            setLoading(false);
          }
        }
      );
    }
  }, [page, currentKategori, currentTanggal]);

  const handleViewFile = async (id, type) => {
    const url = await getShowFileRekap(id, type);
    setFileUrl(url);
    window.open(url, "_blank");
  };

  const handleSearch = () => {
    setLoading(true);
    setSearchParams({ kategori, tanggal, page: 1 });
    GetCategoriesRekapSurat(1, kategori, tanggal).then((res) => {
      if (res.data.letter.length === 0) {
        alert("Data tidak ditemukan");
        setSurat({});
        setLoading(false);
      } else {
        setSurat(res.data);
        setLastPage(res.pagination.last_page);
        setLoading(false);
      }
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      kategori: currentKategori,
      tanggal: currentTanggal,
      page: newPage
    });
    setLoading(true);
    if (currentKategori === "Kategori Surat" && !currentTanggal) {
      GetRekapSurat(newPage).then((res) => {
        setSurat(res.data);
        setLastPage(res.pagination.last_page);
        setBanyakSurat(res.data.letter.length);
        setLoading(false);
      });
    } else {
      GetCategoriesRekapSurat(newPage, currentKategori, currentTanggal).then(
        (res) => {
          setSurat(res.data);
          setLastPage(res.pagination.last_page);
          setBanyakSurat(res.data.letter.length);
          setLoading(false);
        }
      );
    }
  };

  const handleResetFilter = () => {
    setLoading(true);
    setKategori("Kategori Surat");
    setTanggal("");
    setSearchParams({ page: 1 });
    GetRekapSurat(1).then((res) => {
      setSurat(res.data);
      setLastPage(res.pagination.last_page);
      setShowAlert(false);
      setLoading(false);
    });
  };

  return (
    <main className="grid content-start grid-cols-5 bg-gray-200 font-poppins">
      <Sidebar />
      <div className="content col-start-1 xl:col-start-2 ms-4 w-full flex flex-col col-end-6 pl-2 pr-10 pb-10 ">
        <div className="navbar pt-5">
          <h2 className="font-bold text-2xl">Rekap Surat</h2>
        </div>
        <div className="rekap mt-5 bg-white rounded-xl drop-shadow-custom p-6 font-poppins">
          <div className="search grid grid-flow-col grid-cols-8 gap-3">
            <div className="left col-start-1 col-end-7 grid grid-cols-2 gap-4">
              <div className="kategori">
                <select
                  id="month"
                  onChange={Handlerkategori}
                  value={kategori}
                  className="font-medium outline-none rounded-lg w-full outline-2 py-2 pl-2 outline-quaternary text-gray-700 outline-offset-0 text-sm p-1"
                >
                  <option value="Kategori Surat" disabled>
                    Kategori Surat
                  </option>
                  <option value="surat masuk">Surat Masuk</option>
                  <option value="surat keluar">Surat Keluar</option>
                </select>
              </div>
              <div className="tanggal">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={tanggal}
                  className="font-medium outline-none rounded-lg w-full outline-2 py-2 pl-2 outline-quaternary text-gray-700 outline-offset-0 text-sm p-1"
                  onChange={HandlerTanggal}
                />
              </div>
            </div>
            <div className="buttons col-start-7 col-end-9 grid grid-cols-2 gap-2">
              <div
                className="reset-btn bg-red-500 rounded-lg text-white grid justify-center content-center cursor-pointer"
                onClick={handleResetFilter}
              >
                <CgClose className="text-bold" />
              </div>
              <div
                className="search-btn bg-secondary rounded-lg text-white grid justify-center content-center cursor-pointer"
                onClick={handleSearch}
              >
                <FaSearch />
              </div>
            </div>
          </div>
          <div className="tabel mt-7 sm:h-100  overflow-auto ">
            <table className="table-auto w-full text-center">
              <thead className="text-white font-semibold bg-secondary">
                <tr className="">
                  <th className="py-2 text-sm text-start pl-5">No</th>
                  <th className="py-2 text-sm text-start">Pengirim</th>
                  <th className="py-2 text-sm text-start">Jenis</th>
                  <th className="py-2 text-sm ">Tanggal</th>
                  <th className="py-2 text-sm ">Deskripsi</th>
                  <th className="py-2 text-sm ">Draft</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
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
                    : surat?.letter || []
                  ).map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={`${
                          (index + 1) % 2 === 0 ? "bg-quinary" : ""
                        }`}
                      >
                        <td className="py-2 text-sm">
                          {index + 1 + (page - 1) * 10}
                        </td>
                        <td className="py-2 text-sm text-start">{item.from}</td>
                        <td className="py-2 text-sm text-start">{item.type}</td>
                        <td className="py-2 text-sm">{item.date}</td>
                        <td className="py-2 text-sm">{item.description}</td>
                        <td className="py-3.5 text-sm grid place-items-center">
                          <FaFile
                            className="text-primary cursor-pointer"
                            type="button"
                            onClick={() => handleViewFile(item.id, item.type)}
                          />
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
                      onClick={() => handlePageChange(parseInt(page) - 1)}
                    />
                  </a>
                  <a href="#" className="relative inline-flex items-center  ">
                    <span className="sr-only">Next</span>
                    <ArrowCircleRight
                      className={`${
                        surat?.letter?.length < 10 ||
                        surat?.letter?.length === 0 ||
                        page >= lastpage
                          ? "hidden"
                          : ""
                      } h-7 w-7 text-quaternary`}
                      aria-hidden="true"
                      onClick={() => handlePageChange(parseInt(page) + 1)}
                    />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RekapSuratPage;
