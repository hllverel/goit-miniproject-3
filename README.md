# goit-miniproject-3

Managing users and posts using JSONPlaceholder API

🛠️ Kullanılacak Konular

    HTTP/HTTPS → API istekleri için
    REST API → /users ve /posts uç noktaları
    Fetch & Axios → İstek atmak için
    CRUD işlemleri → Kullanıcı/Gönderi ekleme, listeleme, güncelleme, silme
    Query parametreleri → Kullanıcıları filtrelemek, gönderileri sayfalama
    async/await + try/catch → Asenkron isteklerde hata yakalama
    Network sekmesi → İstekleri inceleme

🖥️ Uygulama Özellikleri

    Kullanıcı Listesi Sayfası

    "Kullanıcıları Getir" butonu → API’den /users verisini çeker.
    Kullanıcı adı, e-posta, şirket bilgisi listelenir.

    Gönderiler (Posts) Sayfası

    İlk açılışta 5 gönderi getir.
    "Daha Fazla Yükle" butonuyla sayfalama (_limit & _page).
    Listeye yeni gönderiler eklenir.

    Gönderi Oluştur

    Basit bir form: title + body.
    POST isteği ile /posts’a gönder.
    Başarılı olursa listeye ekle.

    Gönderi Güncelleme

    Her gönderinin yanında "Düzenle" butonu.
    PATCH isteği ile içeriği değiştir.

    Gönderi Silme

    "Sil" butonu → DELETE isteği.
    Silinen gönderi arayüzden kaldırılır.

    Hata Yönetimi

    try/catch + iziToast veya alert ile kullanıcıya hata mesajı göster.

Bu proje, sana HTTP → Fetch → Axios → CRUD → async/await → Pagination konularını pratikte görmeni sağlayacak.
