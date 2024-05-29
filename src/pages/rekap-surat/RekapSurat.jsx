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

const RekapSuratPage = () => {
  const auth = UseAuth();
  const [kategori, setKategori] = useState("Kategori Surat");
  const [tanggal, setTanggal] = useState(FormatDate());
  const [surat, setSurat] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  let [searchParams, setSearchParams] = useSearchParams();
  const [initialSurat, setInitialSurat] = useState({}); // Menyimpan data awal dari backend

  const page = searchParams.get("page") || 1;
  const Handlerkategori = (e) => {
    setKategori(e.target.value);
  };
  const HandlerTanggal = (e) => {
    setTanggal(e.target.value);
  };
  useEffect(() => {
    const kategori = searchParams.get("kategori") || "";
    const tanggal = searchParams.get("tanggal") || "";

    if (kategori === "" && tanggal === "") {
      GetRekapSurat(page).then((res) => {
        setSurat(res.data);
        setInitialSurat(res.data);
        // Setel data awal saat komponen pertama kali dimuat
      });
    } else {
      GetCategoriesRekapSurat(page, kategori, tanggal).then((res) => {
        if (res.data.letter.length === 0) {
          // Jika hasil filter kosong, tampilkan alert
          GetRekapSurat(page).then((res) => {
            setSurat(res.data);
          });
        } else {
          setSurat(res.data);
        }
      });
    }
  }, [page, kategori, tanggal]);

  const handleViewFile = async (id, type) => {
    const url = await getShowFileRekap(id, type);
    setFileUrl(url);
    window.open(url, "_blank");
  };
  const handleSearch = () => {
    // Kirim permintaan filter ke backend dengan kategori dan tanggal yang dipilih
    GetCategoriesRekapSurat(page, kategori, tanggal).then((res) => {
      if (res.data.letter.length === 0) {
        // Jika hasil filter kosong, set showAlert menjadi true
        alert("Data tidak ditemukan");

        setShowAlert(true);
        // dan tidak melakukan perubahan pada state surat
      } else {
        setSurat(res.data);
        setShowAlert(false);
        // Update nilai kategori dan tanggal dalam URL
        setSearchParams({ kategori, tanggal });
      }
    });
  };
  return (
    <main className="grid grid-cols-5 h-screen gap-8 bg-quinary">
      <Sidebar />
      <div className="content col-start-2 col-end-6 w-97/100">
        <div className="navbar pt-5">
          <h2 className="font-bold text-2xl">Rekap Surat</h2>
        </div>
        <div className="rekap mt-5 bg-white h-5/6 rounded-xl drop-shadow-custom p-6 font-poppins">
          <div className="search grid grid-flow-col grid-cols-8 gap-8">
            <div className="left col-start-1 col-end-8 grid grid-cols-2 gap-4">
              <div className="kategori">
                <select
                  id="month"
                  onChange={Handlerkategori}
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
            <div
              className="right bg-secondary rounded-lg text-white grid justify-center content-center cursor-pointer"
              onClick={handleSearch} // Tambahkan onClick untuk menangani klik tombol "Cari"
            >
              <div className="grid grid-flow-col w-10/12 gap-2 items-center ">
                <FaSearch size="1rem" />
                <p>Cari</p>
              </div>
            </div>
          </div>
          <div className="tabel mt-7 h-100 overflow-y-auto">
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

                    <td className="py-4 text-sm grid place-items-center">
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
            {surat?.letter?.length === 0 && (
              <div className="text-center text-red-500">
                Data tidak ditemukan
              </div>
            )}
          </div>
        </div>
        <div className="pagination grid grid-flow-col w-1/6 gap-5 justify-self-center mt-3.5 m-auto">
          <button
            onClick={() => setSearchParams({ page: parseInt(page) - 1 })}
            className={`${
              page == 1 ? "hidden" : null
            } left bg-secondary text-white font-semibold rounded-lg text-sm self-center py-0.5 text-center`}
          >
            back
          </button>
          <button
            onClick={() => setSearchParams({ page: parseInt(page) + 1 })}
            className={`${
              surat?.letter?.length == 0 ? "hidden" : null
            } right bg-secondary text-white font-semibold rounded-lg text-sm self-center py-0.5 text-center`}
          >
            next
          </button>
        </div>
      </div>
    </main>
  );
};

export default RekapSuratPage;
