// src/features/about/components/About.tsx
import { useRef, useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Music,
  Globe,
  GraduationCap,
  Code2,
  MapPin,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { FEATURED_TRACKS } from '../data/playlist';

// Asset imports (Vite resolves these correctly)
import portraitImg from '@/assets/images/about/Cinematic Professional Portrait.png';
import sliitLogo   from '@/assets/images/about/sliit-campus-seeklogo.png';
import mapDark     from '@/assets/images/map-dark.webp';
import mapLight    from '@/assets/images/map-white.webp';

const socials = [
  { name: 'GitHub',    href: import.meta.env.VITE_CONTACT_GITHUB   || 'https://github.com/GayanKavinda', Icon: Github },
  { name: 'LinkedIn',  href: import.meta.env.VITE_CONTACT_LINKEDIN || 'https://linkedin.com/in/yourprofile', Icon: Linkedin },
  { name: 'Twitter/X', href: import.meta.env.VITE_CONTACT_X        || 'https://twitter.com', Icon: Twitter },
].map(({ name, href, Icon }) => {
  const path = href.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '');
  const handle = name === 'LinkedIn' ? path : `@${path.replace(/^\//, '')}`;
  return { name, href, Icon, handle };
});

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
const techStack = [
  { id: 'react',      name: 'React',      category: 'Frontend UI',    icon: 'react/react-original.svg' },
  { id: 'typescript', name: 'TypeScript', category: 'Type Safety',    icon: 'typescript/typescript-original.svg' },
  { id: 'git',        name: 'Git',        category: 'Version Control', icon: 'git/git-original.svg' },
  { id: 'gitlab',     name: 'GitLab CI',  category: 'DevOps & CI/CD', icon: 'gitlab/gitlab-original.svg' },
  { id: 'vscode',     name: 'VS Code',    category: 'Primary IDE',    icon: 'vscode/vscode-original.svg' },
  { id: 'android',    name: 'Android',    category: 'Native Mobile',  icon: 'android/android-original.svg' },
  { id: 'docker',     name: 'Docker',     category: 'Containers',     icon: 'docker/docker-original.svg' },
  { id: 'figma',      name: 'Figma',      category: 'UI/UX Design',   icon: 'figma/figma-original.svg' },
];

const card = 'relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] dark:border-zinc-800 dark:bg-[#0E0E14] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]';
const eyebrow = 'text-[10.5px] font-normal tracking-[0.13em] text-slate-400 dark:text-zinc-500 uppercase';

function ProfileCard() {
  return (
    <div className={`${card} col-span-1 md:col-span-2`} style={{ padding: 0 }}>
      <div className="flex h-full min-h-[340px] flex-col sm:flex-row">
        {/* LEFT: Portrait */}
        <div className="relative w-full sm:w-[42%] shrink-0 min-h-[280px] sm:min-h-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <span aria-hidden className="absolute inset-0 flex items-center justify-center select-none text-[9rem] font-['Playfair_Display',serif] leading-none z-0" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(214,13,134,0.12)' }}>GK</span>
          <img src={portraitImg} alt="Gayan Kavinda" className="absolute inset-0 h-full w-full object-cover object-center z-10 transition-transform duration-700 hover:scale-[1.025]" />
          <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5 pt-14" style={{ background: 'linear-gradient(to top, rgba(8,8,14,0.9) 0%, rgba(8,8,14,0.45) 55%, transparent 100%)' }}>
            <p className="font-['Playfair_Display',serif] text-[1.05rem] font-normal italic leading-snug text-white/90">Gayan Kavinda</p>
            <p className="mt-0.5 text-[10px] font-normal uppercase tracking-[0.18em]" style={{ color: '#d60d86' }}>Full-Stack & DevOps Engineer</p>
          </div>
          <div className="absolute top-4 left-4 z-30">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-black/40 px-2.5 py-1 text-[10px] text-emerald-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Available
            </span>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="relative flex flex-1 flex-col justify-between p-6 sm:px-7 sm:py-6">
          <div aria-hidden className="absolute left-0 top-10 bottom-10 w-[1.5px] hidden sm:block rounded-full" style={{ background: 'linear-gradient(to bottom, transparent, #d60d86 25%, #d60d86 75%, transparent)' }} />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 size={13} className="text-[#d60d86]" />
              <span className={eyebrow}>Software Engineer</span>
            </div>
            <p className="text-sm leading-[1.8] text-slate-600 dark:text-zinc-400">
              I build things that scale — web platforms, cloud microservices, reactive interfaces. I care about architecture that{' '}
              <em className="not-italic text-slate-900 dark:text-white underline underline-offset-2 decoration-[#d60d86]/40">makes sense</em>
              {' '}six months later.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {['Laravel', 'React', 'Next.js', 'Docker', 'Ansible', 'DevOps'].map((t) => (
                <span key={t} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-[5px] text-[11px] text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-slate-100 dark:divide-zinc-800 border-t border-slate-100 dark:border-zinc-800 pt-5">
            {[{ num: '10+', label: 'Years' }, { num: '50+', label: 'Projects' }, { num: '12+', label: 'Systems' }].map((s) => (
              <div key={s.label} className="text-center px-2">
                <span className="block font-['Playfair_Display',serif] text-[1.3rem] italic text-slate-900 dark:text-white leading-none">{s.num}</span>
                <span className="block text-[9.5px] uppercase tracking-wider text-slate-400 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationCard() {
  return (
    <div className={`${card} p-6`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <img src={sliitLogo} alt="SLIIT" className="h-9 w-auto object-contain" />
          <span className="text-[10px] text-slate-400 mt-1 shrink-0">2019 – present</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-1">
            <GraduationCap size={13} className="text-[#d60d86]" />
            <span className={eyebrow}>Education</span>
          </div>
          <p className="text-[11px] text-[#d60d86] mt-2">BSc (Hons) Software Engineering</p>
          <h3 className="text-sm font-normal tracking-tight text-slate-900 dark:text-white mt-0.5 leading-snug">Sri Lanka Institute of<br />Information Technology</h3>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Faculty of Computing</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
        <p className="text-[11px] text-slate-500 dark:text-zinc-400">Software Architecture · Distributed Systems</p>
      </div>
    </div>
  );
}

function LocationCard() {
  const [localTime, setLocalTime] = useState('--:--');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => setLocalTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.classList.contains('dark'));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`${card} p-6`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#d60d86]" />
            <span className={eyebrow}>Location</span>
          </div>
          <span className="text-[10px] text-slate-400">LK</span>
        </div>
        <div className="relative w-full h-[100px] overflow-hidden rounded-xl mb-4">
          <img src={isDark ? mapDark : mapLight} alt="Sri Lanka" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute z-10" style={{ bottom: '38%', left: '22%' }} title="Colombo">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d60d86] opacity-50" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d60d86]" />
            </span>
          </div>
        </div>
        <h3 className="text-base font-normal text-slate-900 dark:text-white">Colombo</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Western Province, Sri Lanka</p>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
        <Globe size={12} className="text-slate-400 shrink-0" />
        <span className="tabular-nums">{localTime}</span>
        <span className="text-slate-300 dark:text-zinc-600">·</span>
        <span className="text-slate-400 text-[10.5px]">GMT+5:30</span>
      </div>
    </div>
  );
}

function SocialCard() {
  return (
    <div className={`${card} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <span className={eyebrow}>Connect</span>
        <span className="text-[10px] text-slate-400">3 channels</span>
      </div>
      <div className="space-y-2">
        {socials.map((s) => (
          <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/50 p-2.5 transition-all duration-200 hover:border-[#d60d86]/30 hover:bg-slate-100/60 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-[#d60d86]/30 dark:hover:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                <s.Icon size={13} />
              </div>
              <div>
                <p className="text-[11.5px] text-slate-800 dark:text-zinc-200">{s.name}</p>
                <p className="text-[10px] text-slate-400">{s.handle}</p>
              </div>
            </div>
            <ArrowUpRight size={13} className="text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d60d86] dark:text-zinc-600" />
          </a>
        ))}
      </div>
    </div>
  );
}

function SpotifyCard() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [durationSec, setDurationSec] = useState(30);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = FEATURED_TRACKS[trackIndex] || FEATURED_TRACKS[0];

  // Initialize or change audio element source
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    if (track.previewUrl) {
      audio.src = track.previewUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }

    const onTimeUpdate = () => {
      setProgressSec(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDurationSec(audio.duration);
      }
    };

    const onEnded = () => {
      // Auto-advance to next track
      setTrackIndex((prev) => (prev + 1) % FEATURED_TRACKS.length);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [trackIndex, track.previewUrl]);

  // Handle play / pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (track.previewUrl) {
        audio.play().catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, track.previewUrl]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTrackIndex((prev) => (prev + 1) % FEATURED_TRACKS.length);
    setProgressSec(0);
  };

  const handlePrevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTrackIndex((prev) => (prev - 1 + FEATURED_TRACKS.length) % FEATURED_TRACKS.length);
    setProgressSec(0);
  };

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextIdx = Math.floor(Math.random() * FEATURED_TRACKS.length);
    setTrackIndex(nextIdx);
    setProgressSec(0);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMuted((prev) => !prev);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * durationSec;
    if (audioRef.current && track.previewUrl) {
      audioRef.current.currentTime = targetTime;
    }
    setProgressSec(targetTime);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayDuration = track.previewUrl ? durationSec : track.durationSec;
  const progressPercent = Math.min(100, (progressSec / (displayDuration || 1)) * 100);

  return (
    <div className={`${card} overflow-hidden group`} style={{ padding: 0 }}>
      {/* Blurred album-art background with smooth transition */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: `url("${track.albumArt}") center/cover no-repeat`,
          filter: 'blur(26px) saturate(1.7) brightness(0.35)',
          transform: 'scale(1.15)',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

      <div className="relative z-10 flex flex-col justify-between h-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              {isPlaying && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-[#1DB954]' : 'bg-slate-400'}`} />
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/60">
              {isPlaying ? 'Now Playing' : 'Paused'}
            </span>
            <span className="text-[9.5px] text-white/40 ml-1">
              ({trackIndex + 1}/{FEATURED_TRACKS.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Volume Control Popout */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                onClick={toggleMute}
                className="h-6 w-6 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>

              <div
                className={`transition-all duration-200 overflow-hidden flex items-center ${
                  showVolume ? 'w-20 opacity-100 ml-1' : 'w-0 opacity-0'
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-18 h-1 accent-[#1DB954] cursor-pointer bg-white/20 rounded-lg"
                  aria-label="Volume slider"
                />
              </div>
            </div>

            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open on Spotify"
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="text-[10px] font-medium text-white/90">Spotify</span>
            </a>
          </div>
        </div>

        {/* Track info and real album cover */}
        <div className="mt-4 flex items-center gap-3.5">
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cover relative h-12 w-12 shrink-0 rounded-lg overflow-hidden shadow-xl ring-1 ring-white/15 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={track.albumArt}
              alt={track.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </a>

          <div className="min-w-0 flex-1">
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-[13px] font-medium text-white hover:underline leading-tight"
            >
              {track.title}
            </a>
            <p className="truncate text-[11px] text-white/65 mt-0.5">{track.artist}</p>
          </div>

          <div className="flex items-center gap-1 text-white/70">
            <button
              onClick={handleShuffle}
              className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all active:scale-95"
              aria-label="Shuffle"
              title="Shuffle track"
            >
              <Shuffle size={12} />
            </button>
            <button
              onClick={handlePrevTrack}
              className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all active:scale-95"
              aria-label="Previous track"
              title="Previous track"
            >
              <SkipBack size={13} />
            </button>
            <button
              onClick={togglePlay}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-[#1DB954] hover:bg-[#1ed760] text-black shadow-lg shadow-[#1DB954]/30 transition-all active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              onClick={handleNextTrack}
              className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all active:scale-95"
              aria-label="Next track"
              title="Next track"
            >
              <SkipForward size={13} />
            </button>
          </div>
        </div>

        {/* Interactive Seek Bar and Sound Equalizer */}
        <div className="mt-4">
          <div
            onClick={handleSeek}
            className="group/seek h-[5px] w-full cursor-pointer relative flex items-center rounded-full bg-white/20 backdrop-blur-sm"
            title="Click to seek"
          >
            <div
              className="h-full rounded-full bg-[#1DB954] group-hover/seek:bg-[#1ed760] transition-all duration-150"
              style={{
                width: `${progressPercent}%`,
                boxShadow: '0 0 10px rgba(29,185,84,0.8)',
              }}
            />
            <div
              className="absolute h-2.5 w-2.5 rounded-full bg-white shadow-md opacity-0 group-hover/seek:opacity-100 transition-opacity -translate-x-1/2 pointer-events-none"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between items-center text-[9.5px] text-white/45">
            <span>{formatTime(progressSec)}</span>
            <div className="flex items-center gap-1">
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 bg-[#1DB954] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                  <span className="w-0.5 bg-[#1DB954] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                  <span className="w-0.5 bg-[#1DB954] rounded-full animate-[pulse_1s_ease-in-out_infinite] h-1.5" />
                </div>
              )}
            </div>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArsenalCard() {
  return (
    <div className={`${card} p-6`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className={eyebrow}>Tech Stack</span>
          <h4 className="text-sm font-normal text-slate-900 dark:text-white mt-0.5">Engineering Arsenal</h4>
        </div>
        <span className="text-[10.5px] text-slate-400">{techStack.length} tools</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {techStack.map((tech) => (
          <div key={tech.id} className="group flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 transition-all duration-200 hover:border-slate-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-zinc-700 dark:hover:bg-zinc-900">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/60 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <img src={DEVICON_BASE + tech.icon} alt={tech.name} className="h-4 w-4 object-contain" loading="lazy" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11.5px] text-slate-800 dark:text-zinc-200">{tech.name}</p>
              <p className="truncate text-[10px] text-slate-400">{tech.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section id="about" ref={sectionRef} className="py-20 md:py-24 relative">
      <div className="max-w-[1040px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <p className={`${eyebrow} mb-2`}>About</p>
          <h2 className="text-2xl md:text-[1.75rem] font-normal text-slate-900 dark:text-white tracking-tight leading-snug">
            The <span className="font-['Playfair_Display',serif] italic text-[#d60d86]">Engineer</span>
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xl">
            10 years building scalable systems. Obsessed with performance, clean architecture, and shipping things that{' '}
            <em className="not-italic text-slate-700 dark:text-zinc-300">actually work</em>.
          </p>
        </div>

        {/* Highlights */}
        <div className="mb-6 rounded-xl border border-slate-200/80 bg-white/60 dark:bg-zinc-900/40 dark:border-zinc-800 px-5 py-4 backdrop-blur-sm">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px] text-slate-600 dark:text-zinc-300 leading-relaxed">
            {[
              'Multi-region event-driven platform — >2M RPS, <50ms p99 latency.',
              'Observability-first practices (OpenTelemetry, SLO alerting) — MTTR ↓40%.',
              'Monolith → Kubernetes microservices — deploy time hours → <15 min.',
              'Internal distributed-tracing library adopted by 8+ teams.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[#d60d86] mt-[2px] shrink-0 text-[10px]">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProfileCard />
          <EducationCard />
          <LocationCard />
          <SocialCard />
          <SpotifyCard />
          <div className="md:col-span-3"><ArsenalCard /></div>
        </div>
      </div>
    </section>
  );
};

export default About;
