# MakiForma, prototyp strony

Statyczny prototyp serwisu MakiForma: opakowania na sushi dla lokali, sieci
i cateringów. Bez frameworka i bez kroku budowania: HTML, jeden arkusz stylów
oraz jeden plik JavaScriptu. Otwierasz i działa.

Serwis ma zbierać zapytania ofertowe B2B. Główne wezwanie: wycena
na podstawie przesłanego zdjęcia opakowania albo inspiracji.

## Podgląd lokalny

Strona ładuje wideo i czcionkę przez `fetch`, więc otwarcie pliku z dysku
(`file://`) nie wystarczy. Potrzebny dowolny serwer statyczny:

```bash
python3 -m http.server 8000
```

Potem `http://localhost:8000/`.

## Mapa stron

| Plik | Co to |
|---|---|
| `index.html` | strona główna, dziesięć sekcji |
| `opakowania.html` | katalog kategorii z filtrami |
| `opakowania-*.html` | dziesięć kart kategorii (lunch, premium, delivery, catering, rolki, zestawy, wkładki, banderole, dodatki, sezonowe) |
| `personalizacja.html` | możliwości zdobień i nadruku |
| `probki.html` | zamówienie próbek |
| `wycena.html` | formularz wyceny, kreator wielokrokowy |
| `o-nas.html` | zaplecze produkcyjne, Forpa |
| `polityka-prywatnosci.html` | polityka prywatności |

## Struktura katalogów

```
assets/
  style.css        wszystkie układy i komponenty, wyłącznie przez var(--token)
  app.js           nawigacja, karuzele, filtry, kreator oraz wideo na scrollu
  img/             115 plików .webp + 2 .mp4
styleguide/
  fonts.css        kroje; ładowany PIERWSZY, przed tokens.css
  tokens.css       kolory, typografia, odstępy i promienie
  fonty/           adelia.woff2 (self-hosting)
```

Kolejność arkuszy w `<head>` jest wiążąca: `fonts.css`, potem `tokens.css`,
potem `assets/style.css`. Wartości kolorów i odstępów siedzą wyłącznie
w `tokens.css`. W `style.css` nie ma surowych liczb, są `var(--token)`.

## Do wdrożenia produkcyjnego

Lista rzeczy, które w prototypie są zaślepką albo świadomym uproszczeniem.

**Wymaga decyzji lub uzupełnienia:**

- **Numer telefonu jest zmyślony.** W `<a href="tel:...">` stoi `+48123456789`.
  Do podmiany na wszystkich stronach.
- **Adres e-mail** `kontakt@makiforma.pl` do potwierdzenia.
- **Licencja kroju „adelia".** Metadane pliku mówią „All rights reserved",
  co wygląda na licencję do użytku osobistego. **Przed wdrożeniem trzeba
  potwierdzić licencję komercyjną** albo zamienić krój. Używany wyłącznie
  w napisie odręcznym w hero na stronie głównej. Krój nie ma polskich znaków
  diakrytycznych, brakujące przejmuje Caveat.
- **Formularze nic nie wysyłają.** Mają `onsubmit="return false"`, walidacja
  jest po stronie przeglądarki. Backend, wysyłka i obsługa załączników
  do zbudowania.
- **Dwa kadry na `opakowania.html` są tymczasowe** i mają to napisane wprost
  plakietką „kadr tymczasowy" w rogu zdjęcia (klasa `.foto--tymczasowa`).
  Stoją tam, dopóki nie dojdzie docelowy materiał. Plakietka znika przez
  `display: none` na `.foto--tymczasowa::after`.
- **Opisy `<meta name="description">` to zaślepki.** Jedenaście kart kategorii
  ma identyczny opis („Karta pojedynczej kategorii opakowań"), a
  `polityka-prywatnosci.html` nie ma żadnego. Do napisania przed indeksowaniem:
  w tej postaci trafią do wyników wyszukiwania.
- **Teksty pochodzą z dokumentu klienta.** Część jest naszą redakcją, część
  wypełniaczem do podmiany. Status per sekcja jest w audycie treści
  po stronie Code & Pixel.

**Świadome uproszczenia prototypu:**

- `fonts.css` ładuje Google Fonts przez `@import`. Na produkcji zamień
  na `<link rel="preconnect">` plus `<link rel="stylesheet">` w `<head>`:
  `@import` blokuje render o jeden RTT dłużej. W prototypie kosztuje mniej
  niż plątanina linków w siedemnastu plikach.
- Obrazy są wyłącznie w `.webp`, bez fallbacku na `.jpg`. Wsparcie ma dziś
  każda aktualna przeglądarka, ale jeśli w grupie docelowej liczą się starsze,
  trzeba dołożyć `<picture>`.
- Strona jest tylko po polsku (`lang="pl"`). Przełącznik języka w nawigacji
  jest atrapą. Brief przewiduje wersje PL, EN i DE, podzbiór `latin-ext`
  w fontach jest już pod to przygotowany.

**Wideo w sekcji o zapleczu produkcyjnym:**

`assets/img/moku-scroll.mp4` przewija się wraz ze scrollem: pozycja sekcji
w oknie ustawia klatkę. Dwie rzeczy, które trzeba zachować przy przepisywaniu:

1. Plik jest pobierany przez `fetch` i podpinany jako **blob**, zamiast przez `src`.
   Skakanie po pliku po sieci wymaga obsługi nagłówka `Range`, a nie każdy
   serwer i CDN ją daje. Blob jest zawsze przewijalny.
2. Plik ma **klatkę kluczową co trzy klatki** (`-g 3` w ffmpeg). Przy zwykłym
   GOP przewijanie się zacina.

Na ekranach poniżej 900 px zamiast przewijania leci zwykła pętla z lżejszego
`moku-z-sushi-4s.mp4`: iOS potrafi nie wczytać danych wideo bez gestu
użytkownika i przewijanie zostałoby na pustym kadrze. Przy
`prefers-reduced-motion` nie wczytuje się nic, zostaje klatka z plakatu.

## Dostępność

Kontrasty tekstu sprawdzone wobec WCAG AA. Tokeny `--c-losos` i `--c-kraft`
mają w `tokens.css` adnotację, że wolno ich używać wyłącznie na ciemnym tle —
na jasnym nie przechodzą progu i nie mogą nieść tekstu ani wypełniać przycisków.
