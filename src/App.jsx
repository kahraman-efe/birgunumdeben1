import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";

// --- ASSET İMPORTLARI ---
import imgKahvaltı from "./assets/kahvaltı.jpeg";
import imgFotom from "./assets/fotom.jpeg";
import imgDers from "./assets/ders.jpeg";
import imgOtobüs from "./assets/otobüsbekleme.jpeg";
import imgFakülte from "./assets/fakültedehasbihal.jpeg";
import imgFakülte1 from "./assets/fakülte2.jpeg";
import imgKahve from "./assets/kahve.jpeg";
import imgDevre from "./assets/devre.jpeg";
import imgSpor from "./assets/spor2.jpeg";
import imgGitar from "./assets/gitar.jpeg";
import imgAksamYemegi from "./assets/aksamyemegi.jpeg";

import imgGÜNBATİMİ from "./assets/günbatımı.jpeg";
import imgDizi from "./assets/fifa.jpeg";
import imgFifa from "./assets/fifa.jpeg";
import imgKedi from "./assets/kedi.jpeg";



import music1 from "./assets/music1.mp3";
import music2 from "./assets/music2.mp3";

// --- VERİ MODELİ ---
const TIMELINE_DATA = [
  {
    time: "09:00", label: "Güne Başlangıç", title: "Güne Kendimle Başlıyorum",
    text: "Güne erken başlayıp,Kahvaltımı yapıp, kampüs ringini bekliyorum durakta.",
    mood: "Güne Hazırlık", detail: "Güne odaklanma.",
     image: imgKahvaltı,
    theme: "dawn", accent: "#6673ff", side: "left", audioSrc: music1,
  },
  {
    time: "09:15", label: "Yolculuk", title: "Otobüs Bekleyişi",
    text: "Kampüse gitmek üzere durağa geçip otobüs bekliyorum.",
    mood: "Sakin", detail: "Sabah rutini ve yolculuk.", image: imgOtobüs,
    theme: "focus", accent: "#b2f63b", side: "right", audioSrc: music1,
  },
  {
  time: "10:30", label: "Kampüs", title: "Fakültede Hasbihal",
  text: "Dersarasında fakültede arkadaşlarla sohbet ediyoruz.",
  mood: "Sosyal", detail: "Kampüs havası ve muhabbet.",
  images: [imgFakülte, imgFakülte1],  // ← tek image yerine dizi
  theme: "focus", accent: "#6366f1", side: "left", audioSrc: music1,
},
  {
    time: "13:30", label: "Laboratuvar", title: "Devre Tasarımı",
    text: "Laboratuvarda breadboard üzerinde devre kurarak donanım tarafında pratiğimi geliştiriyorum.",
    mood: "Analitik", detail: "Kablolar, entegreler ve test.", image: imgDevre,
    theme: "noon", accent: "#5dd6c8", side: "right", audioSrc: music2,
  },
  {
    time: "16:00", label: "Geliştirme", title: "Kahve ve Kodlama",
    text: "Sıcak bir kahve eşliğinde Unity projelerimin script'lerini elden geçiriyorum.",
    mood: "İlham", detail: "Oyun geliştirme ve kafein.", image: imgKahve,
    theme: "golden-hour", accent: "#f59e0b", side: "left", audioSrc: music2,
  },
  {
    time: "18:30", label: "Mola", title: "Gitar ve Müzik",
    text: "Günün yorgunluğunu biraz müzikle atmak için gitarımı elime alıyorum.",
    mood: "Huzur", detail: "Ritim, melodi ve dinlenme.", image: imgGitar,
    theme: "evening", accent: "#fb7185", side: "right", audioSrc: music1,
  },
  {
    time: "20:00", label: "Yenilenme", title: "Akşam Yemeği",
    text: "Kalori takip uygulamama öğünümü girerek günü dengeliyorum. Akşam yemeği vakti.",
    mood: "Sakinleşme", detail: "Mutfak ve enerji toplama.", image: imgAksamYemegi,
    theme: "evening", accent: "#f43f5e", side: "left", audioSrc: music1,
  },
  {
    time: "21:30", label: "Eğlence", title: "Oyun Saati",
    text: "Menajerlik kariyerime dönüp takımımın taktiklerini ayarlayarak kafa dağıtıyorum.",
    mood: "Eğlence", detail: "Rekabet ve keyif.", image: imgFifa,
    theme: "night", accent: "#8b5cf6", side: "right", audioSrc: music2,
  },
  {
    time: "23:30", label: "Kapanış", title: "Geceye Veda",
    text: "Günün sonu. Kedimle beraber sessizliğin tadını çıkarıp yeni güne enerji toplamak için uykuya hazırlanıyoruz.",
    mood: "Dinlenme", detail: "Kapanış, huzur ve uyku.", image: imgKedi,
    theme: "night", accent: "#93c5fd", side: "left", audioSrc: music1,
  },
];

// --- AMBIENT AUDIO PLAYER ---
const AmbientAudio = ({ activeAudioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [activeAudioSrc, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Oynatma engellendi:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      className={`audio-toggle ${isPlaying ? "playing" : ""}`}
      onClick={togglePlay}
      type="button"
      title="Atmosfer Sesini Aç/Kapat"
    >
      <span className="audio-icon">{isPlaying ? "🔊" : "🔇"}</span>
      <span className="audio-text">{isPlaying ? "Müzik Açık" : "Müzik Kapalı"}</span>
      <audio ref={audioRef} src={activeAudioSrc} loop />
    </button>
  );
};

// --- YARDIMCI BİLEŞENLER ---
const StickyClock = ({ activeItem }) => (
  <aside className="sticky-clock" aria-label="Aktif zaman bilgi paneli">
    <small>Aktif Saat</small>
    <span>{activeItem.time}</span>
    <strong>{activeItem.title}</strong>
    <em>{activeItem.mood}</em>
  </aside>
);

const TimelineNav = ({ activeIndex, onNavigate }) => (
  <nav className="timeline-nav" aria-label="Zaman çizgisi navigasyonu">
    {TIMELINE_DATA.map((item, index) => (
      <button
        key={item.time}
        className={index === activeIndex ? "active" : ""}
        onClick={() => onNavigate(index)}
        title={`${item.time} - ${item.title}`}
        type="button"
      >
        <span>{item.time}</span>
      </button>
    ))}
  </nav>
);

// --- ANA UYGULAMA BİLEŞENİ ---
export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRefs = useRef([]);

  const updateScrollState = useCallback(() => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const nextProgress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
    setProgress(nextProgress);

    const viewportCenter = window.scrollY + window.innerHeight * 0.55;
    let closestIndex = 0;
    let closestDistance = Infinity;

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;
      const sectionCenter = section.offsetTop + section.offsetHeight * 0.5;
      const distance = Math.abs(sectionCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updateScrollState();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateScrollState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.25 }
    );
    const currentRefs = sectionRefs.current;
    currentRefs.forEach((section) => { if (section) observer.observe(section); });
    return () => {
      currentRefs.forEach((section) => { if (section) observer.unobserve(section); });
    };
  }, []);

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeItem = TIMELINE_DATA[activeIndex] || TIMELINE_DATA[0];

  return (
    <main
      className={`app ${activeItem.theme}`}
      style={{ "--accent": activeItem.accent, "--progress": `${progress}%` }}
    >
      <h1 className="sr-only">Bir Günümde Ben - İnteraktif Zaman Çizelgesi</h1>
      <div className="ambient-grid" aria-hidden="true" />
      <div className="progress-bar" aria-hidden="true"><div /></div>

      <StickyClock activeItem={activeItem} />
      <AmbientAudio activeAudioSrc={activeItem.audioSrc} />
      <TimelineNav activeIndex={activeIndex} onNavigate={scrollToSection} />

      {TIMELINE_DATA.map((item, index) => (
        <section
          key={item.time}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={`time-section ${item.side === "right" ? "align-right" : ""}`}
          id={`time-${index}`}
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(5,7,12,0.78), rgba(5,7,12,0.32) 48%, rgba(5,7,12,0.72)), url("${item.image}")`,
          }}
        >
          <article className="story-panel">
            <p className="eyebrow">{item.time} / {item.label}</p>
            <h2>{item.title}</h2>
            <p className="lead">{item.text}</p>
            <div className="meta-row">
              <span>{item.mood}</span>
              <span>{item.detail}</span>
            </div>
          </article>
        </section>
      ))}
    </main>
  );
}