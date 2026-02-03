'use strict';

import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js";


axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";


// Kullanıcıları Getir
document.querySelector("#load-users").addEventListener("click", async () => {
  try {
    const res = await axios.get("/users");
    const markup = res.data.map(u => `<li>${u.name} - ${u.email}</li>`).join("");
    document.querySelector("#user-list").innerHTML = markup;
  } catch (err) {
    alert("Kullanıcılar alınamadı!");
  }
});


// Gönderiler
let page = 1;
const limit = 5;


async function loadPosts() {
  try {
    const res = await axios.get("/posts", { params: { _limit: limit, _page: page } });
    const markup = res.data.map(p => `<li><b>${p.title}</b><p>${p.body}</p></li>`).join("");
    document.querySelector("#post-list").insertAdjacentHTML("beforeend", markup);
    page++;
  } catch (err) {
    alert("Gönderiler alınamadı!");
  }
}


document.querySelector("#load-posts").addEventListener("click", loadPosts);
document.querySelector("#load-more").addEventListener("click", loadPosts);


// Yeni Gönderi
document.querySelector("#post-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const newPost = { title: form.title.value, body: form.body.value };


  try {
    const res = await axios.post("/posts", newPost, {
      headers: { "Content-Type": "application/json" }
    });
    alert("Yeni gönderi eklendi!");
    form.reset();
  } catch (err) {
    alert("Gönderi eklenemedi!");
  }
});
