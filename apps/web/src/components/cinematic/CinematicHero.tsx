"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, ShieldCheck, Sparkles, ChevronDown } from "lucide-react";

export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    handleMotionChange(motionQuery);
    motionQuery.addEventListener("change", handleMotionChange);

    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);
    const handleEndedEvent = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const handleErrorEvent = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlayEvent);
    video.addEventListener("playing", handlePlayEvent);
    video.addEventListener("pause", handlePauseEvent);
    video.addEventListener("ended", handleEndedEvent);
    video.addEventListener("error", handleErrorEvent);

    // Initial play attempt if motion is allowed
    if (!motionQuery.matches) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked by browser policy; user interaction required
        setIsPlaying(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlayEvent);
      video.removeEventListener("playing", handlePlayEvent);
      video.removeEventListener("pause", handlePauseEvent);
      video.removeEventListener("ended", handleEndedEvent);
      video.removeEventListener("error", handleErrorEvent);
    };
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        // Playback was prevented or rejected by the browser
        setIsPlaying(false);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const scrollToSequence = () => {
    const target = document.getElementById("cutting-sequence");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden bg-black-deep">
      {/* Background Cinematic Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay={!prefersReducedMotion}
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/images/whole-dressed-center.jpg"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
          aria-label="A1 Chicken Center butcher preparation demonstration"
        >
          <source src="/assets/video/a1-hero-butchery.mp4" type="video/mp4" />
          Your browser does not support HTML5 video playback.
        </video>

        {/* Cinematic Vignette and Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/60 to-black-deep/40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-950/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black-surface/80 border border-brand-800/60 backdrop-blur-md text-brand-100 text-xs sm:text-sm font-semibold mb-8 shadow-xl shadow-brand-950/50">
          <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
          <span className="tracking-wide">Poultry Cuts &bull; Custom Butchery</span>
        </div>

        {/* Main Brand Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-2xl">
          A1 CHICKEN CENTER
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-brand-500 italic tracking-wide mb-8 drop-shadow-lg">
          &ldquo;Freshness You Can Trust.&rdquo;
        </p>

        {/* Sub-headline description */}
        <p className="text-sm sm:text-base md:text-lg text-white-off/80 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          From whole dressed chicken to boneless breast fillets, drumsticks, and curry pieces,
          explore cuts portioned for your home cooking recipes.
        </p>

        {/* Video Playback Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-2 px-4 rounded-2xl bg-black-surface/90 border border-black-border backdrop-blur-lg shadow-2xl mb-12">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-brand-900/40"
            aria-label={isPlaying ? "Pause video presentation" : "Play video presentation"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black-deep hover:bg-black-border text-white-off text-xs sm:text-sm transition border border-black-border"
            aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-black-muted" />
                <span className="text-black-muted">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-brand-500" />
                <span className="text-brand-500 font-medium">Sound On</span>
              </>
            )}
          </button>

          {/* Video Scrub Progress Indicator */}
          <div className="w-24 sm:w-36 h-1.5 bg-black-border rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-brand-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-white-off/70 pl-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Whole &bull; Cut Chicken Options</span>
          </div>
        </div>

        {/* Scroll CTA */}
        <button
          onClick={scrollToSequence}
          className="group flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black-muted hover:text-white transition"
          aria-label="Scroll to cutting sequence"
        >
          <span>Explore The Cut Sequence</span>
          <ChevronDown className="w-5 h-5 text-brand-500 animate-bounce group-hover:text-white transition" />
        </button>
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-800 to-transparent" />
    </section>
  );
}
