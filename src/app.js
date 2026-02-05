'use strict';

import axios from "axios";
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
  
// Kullanıcıları Getir
document.querySelector("#load-users").addEventListener("click", async () => {
    try {
        const res = await axios.get("/users");
        const markup = res.data.map(u => `<li>${u.name} - ${u.email} - ${u.company.name}</li>`).join("");
        document.querySelector("#user-list").innerHTML = markup;
    } catch (err) {
        iziToast.error({
            message: 'Kullanıcılar alınamadı!',
            position: 'topRight'
        });
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
                    <input type="text" name="title" value="${p.title}" placeholder="Başlık" />
                    <textarea name="body" placeholder="İçerik">${p.body}</textarea>
                    <button type="submit" class="save-btn">Kaydet</button>
                    <button type="button" class="cancel-btn">İptal</button>
                    <button type="button" class="delete-btn">Sil</button>
                </form>
            </li>
            `).join("");
        document.querySelector("#post-list").insertAdjacentHTML("beforeend", markup);
        page++;
    } catch (err) {
        iziToast.error({
            message: 'Gönderiler alınamadı!',
            position: 'topRight'
        });
    }
};

document.querySelector("#load-posts").addEventListener("click", loadPosts);
document.querySelector("#load-more").addEventListener("click", loadPosts);

// Düzenleme Formunu Göster/Gizle
document.querySelector("#post-list").addEventListener("click", async (e) => {
    if (e.target.classList.contains("show-edit-btn")) {
        e.preventDefault();
        const form = e.target.nextElementSibling;
        form.style.display = "block";
        e.target.style.display = "none";
    }

    if (e.target.classList.contains("cancel-btn")) {
        e.preventDefault();
        const form = e.target.closest("form");
        form.style.display = "none";
        form.previousElementSibling.style.display = "block";
    }

    // Gönderi Sil
    if (e.target.classList.contains("delete-btn")) {
        e.preventDefault();
        const form = e.target.closest("form");
        const postId = form.closest("li").dataset.postId;

        try {
            await axios.delete(`/posts/${postId}`);
            form.closest("li").remove();

            iziToast.success({
                message: 'Gönderi silindi!',
                position: 'topRight'
            });
        } catch (err) {
            iziToast.error({
                message: 'Gönderi silinemedi!',
                position: 'topRight'
            });
        }
    }
});

// Gönderi Düzenle
document.querySelector("#post-list").addEventListener("submit", async (e) => {
    if (e.target.classList.contains("post-edit")) {
        e.preventDefault();
        const form = e.target;
        const newTitle = form.elements.title.value;
        const newBody = form.elements.body.value;
        
        if (newTitle === "" || newBody === "") {
            iziToast.error({
                message: 'Tüm alanlar doldurulmalı!',
                position: 'topRight'
            });
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
        const postContent = form.closest("li").querySelector("div");
        postContent.querySelector("b").textContent = res.data.title;
        postContent.querySelector("p").textContent = res.data.body;

        form.style.display = "none";
        form.previousElementSibling.style.display = "block";
            
        iziToast.success({
                message: 'Gönderi güncellendi!',
                position: 'topRight'
            });
        } catch (err) {
            iziToast.error({
                message: 'Gönderi güncellenemedi!',
                position: 'topRight'
            });
        }
    }
});

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
                    <button type="button" class="delete-btn">Sil</button>
                </form>
            </li>
            `;
        document.querySelector("#post-list").insertAdjacentHTML("beforeend", markup);

        iziToast.success({
            message: 'Yeni gönderi eklendi!',
            position: 'topRight'
        });
        
        form.reset();
    } catch (err) {
        iziToast.error({
            message: 'Gönderi eklenemedi!',
            position: 'topRight'
        });
    }
});
