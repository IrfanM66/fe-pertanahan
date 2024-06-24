const url = "https://api.simdiskantahjember.com/api";

const GetSuratMasuk = async (page) => {
  const response = await fetch(url + "/show-letters?page=" + page, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};
const GetSearchSuratMasuk = async (typing) => {
  const response = await fetch(url + "/show-letters?typing=" + typing, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};

const GetDetailSuratMasuk = async (id) => {
  const response = await fetch(url + "/show-detail-letters/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};

const DeleteSuratMasuk = async (id) => {
  const response = await fetch(url + "/delete-letter/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};
const PostSuratMasuk = async (data) => {
  const response = await fetch(url + "/add-letters", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    },
    body: data
  });
  const json = await response.json();
  return json;
};

const PutSuratMasuk = async (data, id) => {
  const response = await fetch(url + "/update-letter/" + id, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    },
    body: data
  });
  const json = await response.json();
  return json;
};
const PutDisposisiSurat = async (data, id) => {
  const response = await fetch(url + "/disposition/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  return json;
};

const getShowFile = async (id) => {
  const response = await fetch(url + "/show-file/" + id, {
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

const Notification = async (data) => {
  const response = await fetch(url + "/show-notif", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  return json;
};

export {
  GetSuratMasuk,
  GetDetailSuratMasuk,
  PostSuratMasuk,
  PutSuratMasuk,
  DeleteSuratMasuk,
  PutDisposisiSurat,
  getShowFile,
  Notification,
  GetSearchSuratMasuk
};
