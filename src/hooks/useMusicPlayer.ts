import { useState, useRef, useEffect } from 'react';

export const TRACKS = [
  { id: '1', title: 'MIDNIGHT DRIVE', artist: 'AI GEN / SYNTHWAVE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'ELECTRIC PULSE', artist: 'AI GEN / CYBERCORE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'NEON RAIN', artist: 'AI GEN / AMBIENT', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function formatTime(time: number) {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function useMusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex] || TRACKS[0];

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLoop = () => setIsLooping(!isLooping);

  const changeVolume = (newVol: number) => {
    setVolume(Math.max(0, Math.min(1, newVol)));
    if (isMuted && newVol > 0) setIsMuted(false);
  };

  const selectTrack = (index: number) => {
    if (!TRACKS[index]) return;
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return {
    tracks: TRACKS,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    volume,
    isLooping,
    audioRef,
    togglePlay,
    nextTrack,
    prevTrack,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
    toggleMute,
    changeVolume,
    selectTrack,
    toggleLoop
  };
}
