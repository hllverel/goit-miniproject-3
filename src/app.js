'use strict';

import axios from "axios";
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";
  
// Kullanıcıları Getir
document.querySelector("#load-users").addEventListener("click", async () => {
    try {
        const res = await axios.get("/users");
        const markup = res.data.map(u => `<li>${u.name} - ${u.email} - ${u.company.name}</li>`).join("");
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
        const markup = res.data.map(p => `
            <li data-post-id="${p.id}">
                <div>
                    <b>${p.title}</b>
                    <p>${p.body}</p>
                </div>
                <button class="show-edit-btn">Düzenle</button>
                <form class="post-edit" style="display: none;">
                    <input type="text" name="title" value="${p.title}" placeholder="Başlık" required />
                    <textarea name="body" placeholder="İçerik" required>${p.body}</textarea>
                    <button type="submit" class="save-btn">Kaydet</button>
                    <button type="button" class="cancel-btn">İptal</button>
                </form>
            </li>
            `).join("");
        document.querySelector("#post-list").insertAdjacentHTML("beforeend", markup);

        const editForm = document.querySelector(".post-edit")
        editForm.style.display = "none";

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

        const markup = `
            <li data-post-id="${res.data.id}">
                <div>
                    <b>${res.data.title}</b>
                    <p>${res.data.body}</p>
                </div>
                <button class="show-edit-btn">Düzenle</button>
                <form class="post-edit" style="display: none;">
                    <input type="text" name="title" value="${res.data.title}" placeholder="Başlık" required />
                    <textarea name="body" placeholder="İçerik" required>${res.data.body}</textarea>
                    <button type="submit" class="editBtn" data-post-id="${res.data.id}" data-post-title="${res.data.title}" data-post-body="${res.data.body}">Düzenle</button>
                    <button type="button" class="cancel-btn">İptal</button>
                </form>
            </li>
            `;
        document.querySelector("#post-list").insertAdjacentHTML("beforeend", markup);

        setTimeout(() => {
            alert("Yeni gönderi eklendi!");
        }, 250)
        form.reset();
    } catch (err) {
        alert("Gönderi eklenemedi!");
    }
});

// Gönderi Düzenle
document.querySelector("#post-list").addEventListener("submit", async (e) => {
    if (e.target.classList.contains("post-edit")) {
        e.preventDefault();

        const form = e.target;

        const editForm = document.querySelector(".post-edit")
        editForm.style.display = "block";

        const newTitle = form.elements.title.value;
        const newBody = form.elements.body.value;

        if (newTitle === "" || newBody === "") {
            alert("Tüm alanlar doldurulmalı!");
            return;
        }

        const postId = form.closest("li").dataset.postId;

        try {
            const res = await axios.patch(`/posts/${postId}`, {
                title: newTitle,
                body: newBody
            }, {
            headers: { "Content-Type": "application/json" }
            });
                
            // Update the display
            const postContent = form.previousElementSibling;
            postContent.querySelector("b").textContent = res.data.title;
            postContent.querySelector("p").textContent = res.data.body;

            editTitle.style.display = "none";
            editBody.style.display = "none";
                
            alert("Gönderi güncellendi!");
            } catch (err) {
            alert("Gönderi güncellenemedi!");
            }
}
});
