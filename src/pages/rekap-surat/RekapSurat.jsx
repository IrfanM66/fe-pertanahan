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

const RekapSuratPage = () => {
  const auth = UseAuth();
  const [kategori, setKategori] = useState("Kategori Surat");
  const [tanggal, setTanggal] = useState(FormatDate());
  const [surat, setSurat] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  let [searchParams, setSearchParams] = useSearchParams();
  const [initialSurat, setInitialSurat] = useState({});
  const [showAlert, setShowAlert] = useState(false);

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
    if (currentKategori === "Kategori Surat" && !currentTanggal) {
      GetRekapSurat(page).then((res) => {
        setSurat(res.data);
        setInitialSurat(res.data);
      });
    } else {
      GetCategoriesRekapSurat(page, currentKategori, currentTanggal).then(
        (res) => {
          if (res.data.letter.length === 0) {
            GetRekapSurat(page).then((res) => {
              setSurat(res.data);
            });
          } else {
            setSurat(res.data);
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
    setSearchParams({ kategori, tanggal, page: 1 });
    GetCategoriesRekapSurat(1, kategori, tanggal).then((res) => {
      if (res.data.letter.length === 0) {
        alert("Data tidak ditemukan");
        setSurat({});
      } else {
        setSurat(res.data);
      }
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      kategori: currentKategori,
      tanggal: currentTanggal,
      page: newPage
    });
  };

  const handleResetFilter = () => {
    setKategori("Kategori Surat");
    setTanggal(FormatDate());
    setSearchParams({ page: 1 });
    GetRekapSurat(1).then((res) => {
      setSurat(res.data);
      setShowAlert(false);
    });
  };

  return (
    <main className="grid grid-cols-5 h-screen gap-8 bg-quinary font-poppins">
      <Sidebar />
      <div className="content col-start-2 col-end-6 w-97/100">
        <div className="navbar pt-5">
          <h2 className="font-bold text-2xl">Rekap Surat</h2>
        </div>
        <div className="rekap mt-5 bg-white h-5/6 rounded-xl drop-shadow-custom p-6 font-poppins">
          <div className="search grid grid-flow-col grid-cols-8 gap-8">
            <div className="left col-start-1 col-end-7 grid grid-cols-2 gap-4">
              <div className="kategori">
                <select
                  id="month"
                  onChange={Handlerkategori}
                  value={kategori}
                  className="font-semibold outline-none rounded-lg w-full outline-2 py-2 pl-2 outline-quaternary text-quaternary outline-offset-0 text-sm p-1"
                >
                  <option className="font-semibold" value="Kategori Surat">
                    Kategori Surat
                  </option>
                  <option className="font-semibold" value="surat masuk">
                    surat masuk
                  </option>
                  <option className="font-semibold" value="surat keluar">
                    surat keluar
                  </option>
                </select>
              </div>
              <div className="tanggal">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={tanggal}
                  className="font-semibold outline-none rounded-md w-full outline-2 py-2 outline-quaternary text-quaternary outline-offset-0 text-sm p-1"
                  onChange={HandlerTanggal}
                />
              </div>
            </div>
            <div className="buttons col-start-7 col-end-8 grid grid-cols-2 gap-4">
              <div
                className="reset-btn bg-red-500 rounded-lg text-white grid justify-center content-center cursor-pointer"
                onClick={handleResetFilter}
              >
                <div className="grid grid-flow-col w-10/12 gap-2 items-center ">
                  <p>x</p>
                </div>
              </div>
              <div
                className="search-btn bg-secondary rounded-lg text-white grid justify-center content-center cursor-pointer"
                onClick={handleSearch}
              >
                <div className="grid grid-flow-col w-10/12 gap-2 items-center ">
                  <FaSearch size="1rem" />
                  <p>Cari</p>
                </div>
              </div>
            </div>
          </div>
          <div className="tabel mt-7 sm:h-100 sm:overflow-y-auto lg:overflow-y-visible">
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
                {surat?.letter?.map((item, index) => (
                  <tr
                    key={index}
                    className={`${(index + 1) % 2 == 0 ? "bg-quinary" : null} `}
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
                ))}
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
                        surat?.letter?.length < 10 ? "hidden" : ""
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
