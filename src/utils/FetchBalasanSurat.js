const url = "https://simdiskantahjember.com/api";

const GetBalasanSurat = async (page) => {
  const response = await fetch(url + "/show-reply?page=" + page + "", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};

const GetSearchBalasanSurat = async (typing) => {
  const response = await fetch(url + "/show-reply?typing=" + typing, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};

const DeleteBalasanSurat = async (id) => {
  const response = await fetch(url + "/delete-reply/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};

const GetDetailBalasan = async (id) => {
  const response = await fetch(url + "/show-reply-detail/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};

const PostBalasanSurat = async (id, data) => {
  console.log(id, data);
  const response = await fetch(url + "/add-reply/" + id, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    },
    body: data
  });
  const json = await response.json();
  return json;
};

const PutBalasanSurat = async (id, data) => {
  const response = await fetch(url + "/update-reply/" + id, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    },
    body: data
  });
  const json = await response.json();
  return json;
};

const getShowFileBalas = async (id) => {
  const response = await fetch(url + "/show-file-balas/" + id, {
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

const GetBalasanSuratSpesifik = async (id) => {
  const response = await fetch(url + "/show-reply/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  const json = await response.json();
  return json;
};

export {
  GetBalasanSurat,
  GetDetailBalasan,
  PostBalasanSurat,
  PutBalasanSurat,
  DeleteBalasanSurat,
  getShowFileBalas,
  GetBalasanSuratSpesifik,
  GetSearchBalasanSurat
};
