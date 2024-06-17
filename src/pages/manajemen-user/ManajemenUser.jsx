import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ModalTambah from "../../components/modal/manajemen-user/TambahUser";
import { MdModeEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import {
  GetManagemenUser,
  GetDetailMnagemenUser,
  DelManagemenUser
} from "../../utils/FetchmanagemenUser";
import ModalEdit from "../../components/modal/manajemen-user/EditUser";
import ModalDetail from "../../components/modal/manajemen-user/DetailUser";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAuth from "../../hooks/UseAuth";

const hideActionKakan = ["Kepala Kantor"];
const hideActionSeksi = [
  "Kasubag. TU",
  "Seksi Penetapan Hak & Pendaftaran",
  "Seksi Survei & Pemetaan",
  "Seksi Penataan & Pemberdayaan",
  "Seksi Pengadaan Tanah & Pengembangan",
  "Seksi Pengendalian & Penanganan Sengketa"
];

const ManajemenUserPage = () => {
  const auth = UseAuth();
  const [users, setUsers] = useState([]);
  const [tambah, setTambah] = useState(false);
  const [edit, setEdit] = useState(false);
  const [detail, setDetail] = useState(false);
  const [del, setDel] = useState(false);
  const [detUser, setDetUser] = useState({});

  useEffect(() => {
    (async () => {
      const { status, data } = await GetManagemenUser();
      if (status) {
        setUsers(data);
      }
    })();
  }, []);
  const [search, setSearch] = useState();
  const HandlerSearch = (e) => {
    setSearch(e.target.value);
  };

  const HandlerTambah = ({ status, message }) => {
    if (status) {
      setTambah((prev) => !prev);
      toast.success("User berhasil ditambahkan", {
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
        title: "Gagal!",
        text: message || "Lengkapi data yang kosong!",
        icon: "warning",
        iconColor: "#FB0017",
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      setTambah((prev) => !prev);
    }
  };

  const HandlerEdit = ({ id, status, message }) => {
    if (id) {
      GetDetailMnagemenUser(id).then((res) => {
        setDetUser(res.data);
        setEdit((prev) => !prev);
      });
    } else if (status) {
      setEdit((prev) => !prev);
      toast.success("User berhasil diedit", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      GetManagemenUser().then((res) => {
        setUsers(res.data);
      });
    } else if (status == false) {
      Swal.fire({
        title: "Gagal",
        text: message || "Lengkapi data yang kosong!",
        icon: "error",
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      setEdit((prev) => !prev);
    }
  };
  const HandlerDetail = (id) => {
    if (id) {
      GetDetailMnagemenUser(id).then((res) => {
        setDetUser(res.data);
        setDetail((prev) => !prev);
      });
    } else {
      setDetail((prev) => !prev);
    }
  };

  const HandlerDelete = (id) => {
    DelManagemenUser(id).then((res) => {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    });
  };

  return (
    <main className="grid grid-cols-5 h-screen gap-8 bg-quinary font-poppins">
      <Sidebar modal={tambah} modal2={edit} modal3={detail} />
      <ModalTambah
        modal={tambah}
        HandlerTambah={HandlerTambah}
        setUsers={setUsers}
      />
      <ModalEdit
        modal={edit}
        HandlerEdit={HandlerEdit}
        user={detUser}
        setUsers={setUsers}
      />
      <ModalDetail
        modal={detail}
        HandlerDetail={HandlerDetail}
        user={detUser}
      />
      <div
        className={`${
          tambah || edit || detail ? "blur-sm" : null
        } content col-start-2 col-end-6 w-97/100`}
      >
        <ToastContainer />
        <div className="navbar pt-5">
          <h2 className="font-bold text-2xl">Manajemen User</h2>
        </div>
        <div className="rekap mt-5 bg-white rounded-xl drop-shadow-custom p-6">
          <div className="search flex gap-4 justify-between">
            <div className="left w-1/3 flex relative">
              <input
                type="text"
                className="outline-none rounded-lg w-full outline-2 outline-quaternary text-quaternary outline-offset-0 text-xs py-3 px-3 font-light italic"
                onChange={HandlerSearch}
                value={search}
                placeholder="Cari user..."
              />
              <FaSearch className="absolute right-2 top-3 text-secondary" />
            </div>
            {hideActionKakan.includes(auth?.type) ||
            hideActionSeksi.includes(auth?.type) ? null : (
              <div
                className="right bg-secondary rounded-lg text-white grid justify-center content-center px-5 cursor-pointer"
                onClick={HandlerTambah}
              >
                <div className="grid grid-flow-col gap-2 items-center py-2">
                  <GoPlus size="1rem" />
                  <p>Tambah User</p>
                </div>
              </div>
            )}
          </div>
          <div className="tabel mt-7 h-100 overflow-y-auto">
            <table className="table-auto w-full text-center text-sm font-normal font-poppins">
              <thead className="text-white font-medium bg-secondary ">
                <tr>
                  <th className="py-2">No</th>
                  <th className="py-2">Nama</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => (
                  <tr
                    key={index}
                    className={`${(index + 1) % 2 == 0 ? "bg-quinary" : null} `}
                  >
                    <td className="py-2.5 text-sm">{index + 1}</td>
                    <td className="py-2.5 text-sm">{item.name}</td>
                    <td className="py-2.5 text-sm">{item.email}</td>
                    <td className="py-2.5 text-sm">{item.type}</td>
                    <td className="py-2">
                      <div className="aksi flex justify-center gap-2">
                        {hideActionSeksi.includes(auth?.type) ? null : (
                          <MdModeEdit
                            className="text-secondary cursor-pointer text-xl"
                            onClick={() => HandlerEdit({ id: item.id })}
                          />
                        )}
                        <IoMdEye
                          className="text-yellow-300 cursor-pointer text-xl"
                          onClick={() => HandlerDetail(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManajemenUserPage;
