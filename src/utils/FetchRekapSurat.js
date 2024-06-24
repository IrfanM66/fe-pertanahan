const url = "https://api.simdiskantahjember.com/api";

const GetRekapSurat = async (page) => {
  const response = await fetch(url + "/show-rekap?page=" + page, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};
const GetCategoriesRekapSurat = async (page, kategori, tanggal) => {
  const queryParams = new URLSearchParams({
    page: page,
    kategori: kategori,
    tanggal: tanggal
  });

  const response = await fetch(url + "/show-rekap?" + queryParams.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });

  const json = await response.json();
  return json;
};

const getShowFileRekap = async (id, type) => {
  const response = await fetch(url + "/show-file/" + id + "/" + type, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  return objectUrl;
};

export { GetRekapSurat, getShowFileRekap, GetCategoriesRekapSurat };
