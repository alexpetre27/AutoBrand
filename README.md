Aplicatie AutoBrand

Reprezinta o platforma pentru colectarea, gestionarea si procesarea datelor despre produse si facturi. Acest sistem integreaza functionalitati de web scraping, conversie valutara in timp real si procesarea documentelor PDF.

Functionalitati principale

Web Scraping: Extragerea detaliilor produselor facuta automat de pe platforme externe cu autentificare si programare cron in intervalul 12:00-18:00.
Procesarea facturilor: Extragerea datelor din facturi PDF si generarea rapoartelor in format CSV.
Gestionarea datelor: Interfata web destinata vizualizarii, editarii si stergerii produselor salvate.
Integrarea API Valutar: Preluarea automata a cursului USD-RON pentru a actualiza preturile in timp real.
Filtrare si sortare: Functionalitati de a cauta si de a ordona datele in tabel.
Autentificare: Implementata folosind NextAuth.

Tech Stack

Backend: Java 17, Spring Boot 3, Spring Data JPA si Hibernate.
Frontend: Next.js 15, React, Tailwind CSS.
Database: PostgreSQL 15.
Biblioteci: Jsoup (scraping), Apache PDFBox (procesare PDF), OpenCSV (generare fisiere .csv).

Cerinte minime

Java 17
Node.js 18
O versiune de PostgreSQL recenta

Rulare

Backend:
Creati o baza de date in PostgreSQL.
Configurati fisierul application.properties cu datele de conectare.
Deschideti un terminal in radacina folderului backend si rulati: ./mvnw spring-boot:run

Frontend:

Deschideti un terminal in radacina fisierului frontend.
Rulati: npm install urmata de npm run dev.

Detalii tehnice
Scraper-ul este configurat sa evite datele duplicate in baza de date cu ajutorul verificarilor de unicitate pe numele produsului.
Procesarea PDF se bazeaza pe recunoasterea tiparelor din document si exporta informatiile intr-un format CSV presetat.
Sistemul de autentificare protejeaza rutele aplicatiei care sunt vulnerabile.
