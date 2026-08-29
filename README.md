# Atlasiakids

## Proje Açıklaması
Atlasiakids, çocuklar için dergi ve içerik sunan bir platformdur. Proje, bir frontend (React/Next.js) ve bir backend (Node.js/Express/MongoDB) uygulamasından oluşur.

## Klasör Yapısı

- `backend/` : Sunucu tarafı kodları (Node.js, Express, MongoDB)
- `frontend/` : İstemci tarafı kodları (React/Next.js)

## Kurulum

### 1. Backend Kurulumu

```bash
cd backend
npm install
```

#### Ortam Değişkenleri
Bir `.env` dosyası oluşturun ve gerekli ortam değişkenlerini ekleyin:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

#### Sunucuyu Başlatma
```bash
npm start
```
veya
```bash
node server.js
```

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

## Kullanılan Teknolojiler
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend: React, Next.js, CSS

## Seed Data
Veritabanını örnek verilerle doldurmak için:

```bash
node seed.js
```

## Katkıda Bulunma
1. Fork'layın
2. Yeni bir branch oluşturun (`git checkout -b feature/ozellik`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Açıklama'`)
4. Push'layın (`git push origin feature/ozellik`)
5. Pull request oluşturun

## Lisans
MIT
