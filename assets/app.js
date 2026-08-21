/* Wireframe: tylko to, co musi działać, żeby dało się ocenić układ. */
(function () {
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var otwarte = menu.hasAttribute('data-otwarte');
      if (otwarte) { menu.removeAttribute('data-otwarte'); }
      else { menu.setAttribute('data-otwarte', ''); }
      burger.setAttribute('aria-expanded', String(!otwarte));
      burger.textContent = otwarte ? 'Menu' : 'Zamknij';
    });
  }

  /* Wysłanie formularza wyceny: formularz znika, wchodzi potwierdzenie */
  var wyslij = document.querySelector('[data-wyslij]');
  var potwierdzenie = document.getElementById('potwierdzenie');
  var formularz = document.getElementById('formularz');
  if (wyslij && potwierdzenie && formularz) {
    wyslij.addEventListener('click', function () {
      formularz.hidden = true;
      potwierdzenie.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Zakładki pionowe: jedna lista, jeden panel widoczny */
  var tablist = document.querySelector('.taby__lista');
  if (tablist) {
    var taby = tablist.querySelectorAll('[data-tab]');
    taby.forEach(function (b) {
      b.addEventListener('click', function () {
        taby.forEach(function (x) {
          var wybrany = x === b;
          x.setAttribute('aria-selected', String(wybrany));
          var panel = document.getElementById('panel-' + x.getAttribute('data-tab'));
          if (panel) { panel.hidden = !wybrany; }
        });
      });
    });
  }

  /* Przełącznik trybu audytu treści */
  var audyt = document.querySelector('[data-audyt]');
  if (audyt) {
    audyt.addEventListener('click', function () {
      var off = document.body.getAttribute('data-audyt') === 'off';
      document.body.setAttribute('data-audyt', off ? 'on' : 'off');
      audyt.textContent = off ? 'Ukryj' : 'Pokaż';
    });
  }

  /* Lista języków zamyka się kliknięciem obok i Escape */
  var lang = document.querySelector('.lang');
  if (lang) {
    document.addEventListener('click', function (e) {
      if (lang.open && !lang.contains(e.target)) { lang.open = false; }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lang.open) { lang.open = false; }
    });
  }

  /* Pasek kotwic: podświetlenie aktywnej kategorii */
  var kotwice = document.querySelectorAll('.kotwice a');
  if (kotwice.length) {
    var cele = [];
    kotwice.forEach(function (a) {
      var cel = document.querySelector(a.getAttribute('href'));
      if (cel) { cele.push({ link: a, cel: cel }); }
    });
    var obs = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        var para = cele.find(function (p) { return p.cel === w.target; });
        if (para && w.isIntersecting) {
          kotwice.forEach(function (a) { a.style.color = ''; });
          para.link.style.color = 'var(--w-ink)';
        }
      });
    }, { rootMargin: '-120px 0px -70% 0px' });
    cele.forEach(function (p) { obs.observe(p.cel); });
  }

  /* Karuzele: na stronie jest ich więcej niż jedna, więc strzałka musi
     wiedzieć, który tor przesuwa. Wiąże je atrybut data-tor. */
  document.querySelectorAll('.karuzela__tor').forEach(function (tor) {
    var ster = document.querySelectorAll('[data-karuzela][data-tor="' + tor.id + '"]');
    if (!ster.length) { return; }

    var skok = function () {
      var kafel = tor.firstElementChild;
      if (!kafel) { return tor.clientWidth; }
      var odstep = parseFloat(getComputedStyle(tor).columnGap) || 0;
      return kafel.getBoundingClientRect().width + odstep;
    };
    var odswiez = function () {
      var max = tor.scrollWidth - tor.clientWidth - 1;
      ster.forEach(function (b) {
        var wstecz = b.getAttribute('data-karuzela') === 'wstecz';
        b.disabled = wstecz ? tor.scrollLeft <= 0 : tor.scrollLeft >= max;
      });
      /* Strzałka stoi w pionie na środku całego kafelka, razem z tytułem
         i podpisem. Wysokość mierzymy, bo zależy od długości opisu. */
      var kafel = tor.firstElementChild;
      if (kafel) {
        tor.parentElement.style.setProperty(
          '--wys-kafla', Math.round(kafel.getBoundingClientRect().height) + 'px');
      }
    };

    ster.forEach(function (b) {
      b.addEventListener('click', function () {
        var kierunek = b.getAttribute('data-karuzela') === 'wstecz' ? -1 : 1;
        tor.scrollBy({ left: kierunek * skok(), behavior: 'smooth' });
      });
    });
    tor.addEventListener('scroll', odswiez, { passive: true });
    window.addEventListener('resize', odswiez);
    odswiez();
  });

  /* Formularz wyceny: trzy kroki, jeden widoczny naraz */
  var panele = document.querySelectorAll('[data-krok]');
  if (panele.length) {
    var pokaz = function (nr) {
      panele.forEach(function (p) {
        p.hidden = p.getAttribute('data-krok') !== String(nr);
      });
      document.querySelectorAll('.postep span').forEach(function (s, i) {
        if (i < nr) { s.setAttribute('data-aktywny', ''); }
        else { s.removeAttribute('data-aktywny'); }
      });
      window.scrollTo({ top: document.querySelector('.wizard').offsetTop - 100, behavior: 'smooth' });
    };
    document.querySelectorAll('[data-idz]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        pokaz(parseInt(b.getAttribute('data-idz'), 10));
      });
    });
  }

  /* Zakładki opisu produktu: jeden panel widoczny, strzałki przełączają */
  document.querySelectorAll('[data-zakladki]').forEach(function (grupa) {
    var taby = Array.prototype.slice.call(grupa.querySelectorAll('[role="tab"]'));
    var pokaz = function (nr) {
      taby.forEach(function (t, i) {
        var wybrany = i === nr;
        t.setAttribute('aria-selected', String(wybrany));
        t.tabIndex = wybrany ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !wybrany;
      });
      taby[nr].focus();
    };
    taby.forEach(function (t, i) {
      t.addEventListener('click', function () { pokaz(i); });
      t.addEventListener('keydown', function (e) {
        var krok = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!krok) { return; }
        e.preventDefault();
        pokaz((i + krok + taby.length) % taby.length);
      });
    });
  });

  /* Nakład: minimum pilnowane w polu, komunikat zamiast cichej korekty */
  document.querySelectorAll('[data-naklad]').forEach(function (pole) {
    var info = document.getElementById(pole.getAttribute('aria-describedby'));
    var min = parseInt(pole.getAttribute('min'), 10);
    var bazowy = info.innerHTML;
    pole.addEventListener('input', function () {
      var za_malo = pole.value !== '' && parseInt(pole.value, 10) < min;
      info.innerHTML = za_malo ? '<span class="redakcja">Nie realizujemy nakładów poniżej ' + min + '&nbsp;szt.</span>' : bazowy;
      [info, pole.closest('.naklad')].forEach(function (el) {
        if (za_malo) { el.setAttribute('data-blad', ''); }
        else { el.removeAttribute('data-blad'); }
      });
    });
    pole.addEventListener('blur', function () {
      if (pole.value !== '' && parseInt(pole.value, 10) < min) {
        pole.value = min;
        pole.dispatchEvent(new Event('input'));
      }
    });
  });

  /* Wejścia przy scrollu: elementy dostają .anim, obserwator dokłada .anim--in.
     Rodzeństwo w jednym kontenerze wchodzi kaskadą (70 ms na element, max 350).
     Bez JS i przy ograniczeniu ruchu w systemie strona stoi statycznie. */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cele = document.querySelectorAll([
      '.sekcja h2', '.naglowek-rzad', '.deklaracja',
      '.benefit', '.fakt', '.krok', '.row',
      'a.karta', '.karta--tekst', '.produkt',
      '.split__tekst', '.split > .foto', '.split > .ph',
      '.hero-foto__naglowek', '.hero .lead', '.hero .btn-grupa', '.hero__obraz',
      '.akordeon details', '.speclist > div', '.formularz__tekst', '.formularz__panel'
    ].join(', '));

    var licznikRodzica = new Map();
    cele.forEach(function (el) {
      if (el.closest('.anim')) { return; }   /* bez animacji w animacji */
      var n = licznikRodzica.get(el.parentElement) || 0;
      licznikRodzica.set(el.parentElement, n + 1);
      el.classList.add('anim');
      el.style.setProperty('--anim-delay', Math.min(n * 70, 350) + 'ms');
    });

    var obserwator = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        if (!w.isIntersecting) { return; }
        w.target.classList.add('anim--in');
        obserwator.unobserve(w.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.anim').forEach(function (el) { obserwator.observe(el); });
  }

  /* Przycisk-magnes w hero: wędruje za kursorem z opóźnieniem (lerp 0.07),
     po zjechaniu kursorem z sekcji wraca na miejsce. Tylko mysz i tylko bez
     ograniczenia ruchu; na dotyku przycisk stoi. */
  var kolo = document.querySelector('[data-magnes]');
  var obszar = document.querySelector('[data-magnes-obszar]');
  if (kolo && obszar &&
      window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
    var cel = { x: 0, y: 0 };
    var poz = { x: 0, y: 0 };
    var dom = null;   /* środek przycisku w spoczynku, liczony przy pierwszym ruchu */
    var raf = null;

    var krok = function () {
      poz.x += (cel.x - poz.x) * 0.07;
      poz.y += (cel.y - poz.y) * 0.07;
      kolo.style.transform = 'translate(' + poz.x + 'px,' + poz.y + 'px)';
      if (Math.abs(cel.x - poz.x) + Math.abs(cel.y - poz.y) > 0.4) {
        raf = requestAnimationFrame(krok);
      } else { raf = null; }
    };
    var rusz = function () { if (!raf) { raf = requestAnimationFrame(krok); } };

    obszar.addEventListener('mousemove', function (e) {
      if (!dom) {
        var r = kolo.getBoundingClientRect();
        dom = { x: r.left + r.width / 2 - poz.x, y: r.top + r.height / 2 - poz.y };
      }
      var o = obszar.getBoundingClientRect();
      /* cel: kursor, ale przycisk nie wychodzi poza sekcję */
      var x = Math.min(Math.max(e.clientX, o.left + 90), o.right - 90) - dom.x;
      var y = Math.min(Math.max(e.clientY, o.top + 90), o.bottom - 90) - dom.y;
      cel.x = x; cel.y = y;
      rusz();
    });
    obszar.addEventListener('mouseleave', function () { cel.x = 0; cel.y = 0; rusz(); });
    window.addEventListener('scroll', function () { dom = null; }, { passive: true });
    window.addEventListener('resize', function () { dom = null; });
  }

  /* Deklaracja B2B: tekst zaczyna jasny i ciemnieje słowo po słowie w miarę
     scrolla. Podział po zwykłych spacjach, więc twarde spacje (sieroty)
     zostają wewnątrz słów. */
  var dek = document.querySelector('.deklaracja');
  if (dek && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var slowa = dek.textContent.split(' ').filter(Boolean);
    dek.innerHTML = slowa.map(function (w) { return '<span>' + w + '</span>'; }).join(' ');
    var spany = dek.querySelectorAll('span');
    var odswiezDek = function () {
      var r = dek.getBoundingClientRect();
      var start = window.innerHeight * 0.9;
      var koniec = window.innerHeight * 0.42;
      var postep = (start - r.top) / (start - koniec);
      postep = Math.max(0, Math.min(1, postep));
      var prog = Math.round(postep * spany.length);
      spany.forEach(function (sp, i) { sp.classList.toggle('ciemne', i < prog); });
    };
    window.addEventListener('scroll', function () { requestAnimationFrame(odswiezDek); }, { passive: true });
    odswiezDek();
  }
})();


/* Wideo w karcie gra tylko pod kursorem; zdjęcie z posteru wraca po zjęciu.
   Na dotyku zostaje poster, bo hover tam nie istnieje. */
document.querySelectorAll('[data-hover-wideo]').forEach(function (w) {
  var karta = w.closest('a') || w;
  karta.addEventListener('mouseenter', function () { w.play(); });
  karta.addEventListener('mouseleave', function () { w.pause(); w.currentTime = 0; });
});


/* Film w sekcji Forpy jedzie scrollem: pozycja sekcji w oknie ustawia klatkę,
   zamiast puszczać wideo własnym tempem. Plik do przewijania ma klatkę kluczową
   co trzy klatki (`-g 3`), więc skok w dowolne miejsce dekoduje najwyżej dwie
   klatki wstecz i nie widać zacięcia.

   Trzy tryby, bo trzy różne sytuacje:
   - desktop: przewijanie scrollem (`moku-scroll.mp4`, gęste klatki kluczowe),
   - dotyk: zwykła pętla (`moku-z-sushi-4s.mp4`, lżejszy) — iOS potrafi nie wczytać
     danych wideo bez gestu użytkownika i przewijanie zostaje na czarnym kadrze,
   - mniej ruchu: nic się nie wczytuje, zostaje klatka z plakatu.

   Plik waży ponad megabajt, a sekcja leży głęboko na stronie, więc źródło
   podpina się dopiero, gdy sekcja zbliża się na wysokość okna. */
(function () {
  var kadr = document.querySelector('.forpa__kadr');
  if (!kadr) return;
  var wideo = kadr.querySelector('video');
  var sekcja = kadr.closest('.forpa');
  if (!wideo || !sekcja) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var szeroki = matchMedia('(min-width: 900px)');
  var tryb = null;
  var czeka = false;
  var blisko = false;

  function podepnij() {
    var chciany = szeroki.matches ? 'scroll' : 'petla';
    if (tryb === chciany || !blisko) return;
    tryb = chciany;
    wideo.preload = 'auto';

    if (chciany === 'petla') {
      wideo.loop = true;
      wideo.src = wideo.getAttribute('data-wideo-petla');
      wideo.load();
      wideo.play().catch(function () {});
      return;
    }

    /* Przewijanie wymaga skakania po pliku, a skok po sieci działa tylko wtedy,
       gdy serwer obsługuje nagłówek `Range`. Podglądowy `python3 -m http.server`
       go ignoruje i `currentTime` zostaje na zerze; część hostingów i CDN-ów
       potrafi to samo. Dlatego plik idzie w całości do pamięci i podpina się
       jako blob: taki adres jest zawsze przewijalny, a przy 1,1 MB pobranym
       dopiero przy zbliżeniu do sekcji to uczciwa cena. */
    wideo.loop = false;
    var adres = wideo.getAttribute('data-wideo-scroll');
    fetch(adres).then(function (o) {
      if (!o.ok) throw new Error(o.status);
      return o.blob();
    }).then(function (blob) {
      if (tryb !== 'scroll') return;
      wideo.src = URL.createObjectURL(blob);
      wideo.addEventListener('loadedmetadata', policz, { once: true });
    }).catch(function () {
      /* Nie udało się pobrać: zostaje klatka z plakatu, sekcja działa dalej. */
      tryb = null;
    });
  }

  /* Postęp liczony przez całe przejście sekcji przez okno: zero, gdy jej górna
     krawędź dotyka dołu okna, jedynka, gdy dolna dochodzi do góry. Historia
     z pałeczkami rozkłada się wtedy na cały czas, w którym sekcję widać. */
  function policz() {
    czeka = false;
    if (tryb !== 'scroll') return;
    var d = wideo.duration;
    if (!d || !isFinite(d) || wideo.readyState < 1) return;
    var r = sekcja.getBoundingClientRect();
    var p = (innerHeight - r.top) / (innerHeight + r.height);
    p = Math.min(1, Math.max(0, p));
    /* Ostatnia klatka zamiast końca ścieżki: dokładnie na `duration`
       przeglądarka potrafi oddać pustą klatkę. */
    var t = p * (d - 1 / 24);
    if (Math.abs(wideo.currentTime - t) > 0.01) wideo.currentTime = t;
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (wpisy) {
      blisko = wpisy[0].isIntersecting;
      if (!blisko) { if (tryb === 'petla') wideo.pause(); return; }
      podepnij();
      if (tryb === 'petla') wideo.play().catch(function () {});
      policz();
    }, { rootMargin: '100% 0px' }).observe(sekcja);
  } else {
    blisko = true;
    podepnij();
  }

  addEventListener('scroll', function () {
    if (!czeka) { czeka = true; requestAnimationFrame(policz); }
  }, { passive: true });
  addEventListener('resize', function () { podepnij(); policz(); });
})();


  /* Pasek postępu pod torem karuzeli. Wstawiany z JS, bo bez skryptu nie ma
     czego pokazywać: tor przewija się wtedy natywnie i pasek byłby ozdobą. */
  document.querySelectorAll('.karuzela__tor').forEach(function (tor) {
    var pasek = document.createElement('div');
    pasek.className = 'karuzela__pasek';
    pasek.setAttribute('aria-hidden', 'true');
    var uchwyt = document.createElement('i');
    pasek.appendChild(uchwyt);
    tor.parentElement.appendChild(pasek);

    var odswiez = function () {
      var zapas = tor.scrollWidth - tor.clientWidth;
      if (zapas < 8) { pasek.hidden = true; return; }
      pasek.hidden = false;
      var udzial = tor.clientWidth / tor.scrollWidth;
      var postep = tor.scrollLeft / zapas;
      uchwyt.style.width = (udzial * 100) + '%';
      uchwyt.style.transform = 'translateX(' + (postep * (100 / udzial - 100)) + '%)';
    };
    tor.addEventListener('scroll', odswiez, { passive: true });
    window.addEventListener('resize', odswiez);
    odswiez();
  });

/* Galeria kategorii: klik w miniaturę zamienia ją miejscami z kadrem głównym.
   Zamiana, nie podmiana, bo kadr główny nie powtarza się wśród miniatur
   i podmiana kasowałaby jedno ujęcie z galerii. */
(function () {
  var galeria = document.querySelector('.galeria');
  if (!galeria) return;
  var glowna = galeria.querySelector('.galeria__glowna figure');
  if (!glowna) return;

  galeria.addEventListener('click', function (e) {
    var mini = e.target.closest('.galeria__mini');
    if (!mini) return;
    var mala = mini.querySelector('figure');
    if (!mala) return;

    var klasyG = glowna.className, klasyM = mala.className;
    mini.replaceChild(glowna, mala);
    document.querySelector('.galeria__glowna').appendChild(mala);
    glowna.className = klasyM;
    mala.className = klasyG;

    var alt = mala.querySelector('img');
    mini.setAttribute('aria-label', 'Pokaż w powiększeniu: ' +
      (glowna.querySelector('img') ? glowna.querySelector('img').alt : 'zdjęcie produktu'));
    glowna = mala;
    if (alt) alt.focus && mini.blur();
  });

})();
