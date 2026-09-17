import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';

interface PuzzleVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetIdentifier?: string; // e.g. email or phone
}

interface PuzzleScene {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  accentColor: string;
}

const PUZZLE_SCENES: PuzzleScene[] = [
  {
    id: 'citadel',
    name: 'OKNexus Cyber Citadel',
    subtitle: 'Institutional Headquarters • Security Node',
    imageUrl: '/puzzles/oknexus-citadel.jpg',
    accentColor: '#A855F7',
  },
  {
    id: 'vault',
    name: 'Quantum Security Vault',
    subtitle: 'Cold Storage Multi-Sig Chamber',
    imageUrl: '/puzzles/oknexus-vault.jpg',
    accentColor: '#06B6D4',
  },
  {
    id: 'trading-desk',
    name: 'Trading Command Center',
    subtitle: 'Institutional High-Frequency Floor',
    imageUrl: '/puzzles/oknexus-trading-desk.jpg',
    accentColor: '#EC4899',
  },
  {
    id: 'orbital-node',
    name: 'Orbital Blockchain Node',
    subtitle: 'Deep-Space Satellite Relay',
    imageUrl: '/puzzles/oknexus-orbital-node.jpg',
    accentColor: '#3B82F6',
  },
];

// Classic SVG jigsaw tab puzzle path (50x50 bounds, no out-of-box clipping)
const PUZZLE_PIECE_CLIP_PATH =
  "path('M 6,6 L 20,6 C 20,0 30,0 30,6 L 44,6 L 44,20 C 50,20 50,30 44,30 L 44,44 L 30,44 C 30,50 20,50 20,44 L 6,44 L 6,30 C 0,30 0,20 6,20 Z')";

const PIECE_SIZE = 50;
const PADDING_X = 10;

export const PuzzleVerificationModal: React.FC<PuzzleVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetIdentifier,
}) => {
  // Current active branded scene index (0-3)
  const [sceneIndex, setSceneIndex] = useState(0);
  // Target position in percentage (e.g. 45% to 80% along available travel track)
  const [targetPercent, setTargetPercent] = useState(65);
  // Target Y offset in pixels
  const [targetY, setTargetY] = useState(48);
  // Slider progress (0 to 100)
  const [sliderValue, setSliderValue] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(342);
  const [containerHeight, setContainerHeight] = useState(176);

  const currentScene = useMemo(() => PUZZLE_SCENES[sceneIndex], [sceneIndex]);

  // Monitor container size accurately across mobile/desktop
  useEffect(() => {
    if (!isOpen) return;

    const measureSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) setContainerWidth(rect.width);
        if (rect.height > 0) setContainerHeight(rect.height);
      }
    };

    // Initial measure
    measureSize();
    const rafId = requestAnimationFrame(measureSize);

    // ResizeObserver for responsive layout updates
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(() => measureSize());
      observer.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [isOpen]);

  // Max horizontal travel for the piece
  const maxTravel = useMemo(() => {
    return Math.max(120, containerWidth - PIECE_SIZE - PADDING_X * 2);
  }, [containerWidth]);

  // Target X position in pixels
  const targetX = useMemo(() => {
    return PADDING_X + (targetPercent / 100) * maxTravel;
  }, [targetPercent, maxTravel]);

  // Current Piece X position in pixels
  const pieceX = useMemo(() => {
    return PADDING_X + (sliderValue / 100) * maxTravel;
  }, [sliderValue, maxTravel]);

  // Pixel difference between piece and target cutout
  const pixelDiff = useMemo(() => {
    return Math.abs(pieceX - targetX);
  }, [pieceX, targetX]);

  // Real-time alignment indicator (within 12px)
  const isAligned = pixelDiff <= 12;
  const isNear = pixelDiff <= 26;

  // Reset or randomize target coordinates on open or refresh
  const initNewPuzzle = (forcedSceneIndex?: number) => {
    if (typeof forcedSceneIndex === 'number') {
      setSceneIndex(forcedSceneIndex);
    } else {
      setSceneIndex((prev) => (prev + 1) % PUZZLE_SCENES.length);
    }

    // Target between 40% and 82% of width so the user slides comfortably
    const randomTargetX = 42 + Math.floor(Math.random() * 38);
    // Vertical position between 24px and 85px
    const randomTargetY = 24 + Math.floor(Math.random() * 55);

    setTargetPercent(randomTargetX);
    setTargetY(randomTargetY);
    setSliderValue(0);
    setStatus('idle');
    setErrorMessage('');
    setIsImageLoaded(false);
  };

  useEffect(() => {
    if (isOpen) {
      initNewPuzzle(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'success') return;
    setSliderValue(Number(e.target.value));
    if (status === 'failed') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleVerify = () => {
    if (status === 'success') return;

    // Generous, natural human tolerance: within 12px
    if (pixelDiff <= 12) {
      // Snap directly into cutout slot
      setSliderValue(targetPercent);
      setStatus('success');
      setErrorMessage('');

      try {
        navigator.vibrate?.([30, 20, 50]);
      } catch (e) {
        // Ignore haptics failure
      }

      setTimeout(() => {
        onSuccess();
      }, 650);
    } else {
      setStatus('failed');
      setErrorMessage('Alignment mismatch. Fit the piece inside the target cutout.');
      setTimeout(() => {
        setSliderValue(0);
        setStatus('idle');
      }, 1000);
    }
  };

  const handleDevQuickVerify = () => {
    setSliderValue(targetPercent);
    setStatus('success');
    setErrorMessage('');
    try {
      navigator.vibrate?.([30, 20, 50]);
    } catch (e) {
      // Ignore
    }
    setTimeout(() => {
      onSuccess();
    }, 450);
  };

  // Canvas direct drag support
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (status === 'success') return;
    setIsDraggingCanvas(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updatePositionFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingCanvas || status === 'success') return;
    updatePositionFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingCanvas) return;
    setIsDraggingCanvas(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore
    }
    handleVerify();
  };

  const updatePositionFromPointer = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left - PADDING_X - PIECE_SIZE / 2;
    const ratio = Math.max(0, Math.min(1, relativeX / maxTravel));
    setSliderValue(Math.round(ratio * 100));
    if (status === 'failed') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-[#0E121E] border border-slate-200 dark:border-purple-500/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors">
        {/* Ambient subtle glow */}
        <div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30 transition-colors"
          style={{ backgroundColor: currentScene.accentColor }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08] mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Security Verification</h3>
                <span className="text-[10px] font-mono-num font-semibold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                  {sceneIndex + 1}/4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Slide to match the OKNexus mosaic piece</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Close verification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scene Info Pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#141B28] border border-slate-200 dark:border-white/[0.06] mb-3 text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <ImageIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{currentScene.name}</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">OKNexus Web3 AI</span>
        </div>

        {/* Mosaic Puzzle Canvas Area */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/[0.1] select-none shadow-inner mb-3 group touch-none cursor-grab active:cursor-grabbing"
        >
          {/* Main Background OKNexus Scene Image */}
          <img
            src={currentScene.imageUrl}
            alt={currentScene.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            draggable={false}
          />

          {/* Fallback skeleton while image loads */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-slate-900 to-indigo-950/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <OKNexusLogo size={36} />
                <span className="text-[11px] text-purple-300 font-semibold animate-pulse">Loading verified scene...</span>
              </div>
            </div>
          )}

          {/* Missing Target Cutout Slot in Picture */}
          <div
            className="absolute pointer-events-none transition-all duration-75"
            style={{
              left: `${targetX}px`,
              top: `${targetY}px`,
              width: `${PIECE_SIZE}px`,
              height: `${PIECE_SIZE}px`,
            }}
          >
            {/* Dark indented shadow matching puzzle shape */}
            <div
              className={`w-full h-full transition-colors ${
                isAligned
                  ? 'bg-emerald-950/80 shadow-[inset_0_0_16px_rgba(16,185,129,0.8)] border-2 border-emerald-400'
                  : isNear
                  ? 'bg-amber-950/70 shadow-[inset_0_0_12px_rgba(245,158,11,0.6)] border-2 border-amber-400'
                  : 'bg-black/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)] border border-white/40 border-dashed'
              }`}
              style={{ clipPath: PUZZLE_PIECE_CLIP_PATH }}
            />
            {/* Subtle pulsator inside cutout */}
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <div
                className={`w-3.5 h-3.5 rounded-full animate-ping ${
                  isAligned ? 'bg-emerald-400' : isNear ? 'bg-amber-400' : 'bg-purple-400'
                }`}
              />
            </div>
          </div>

          {/* Draggable Puzzle Piece (Shows the exact sliced image piece) */}
          <div
            className={`absolute pointer-events-none transition-transform ${
              status === 'success'
                ? 'scale-105 filter drop-shadow-[0_0_16px_#10B981]'
                : status === 'failed'
                ? 'filter drop-shadow-[0_0_12px_#F43F5E]'
                : isAligned
                ? 'filter drop-shadow-[0_0_14px_#10B981]'
                : isNear
                ? 'filter drop-shadow-[0_0_10px_#F59E0B]'
                : 'filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]'
            }`}
            style={{
              left: `${pieceX}px`,
              top: `${targetY}px`,
              width: `${PIECE_SIZE}px`,
              height: `${PIECE_SIZE}px`,
            }}
          >
            {/* Cropped Image Slice - uses exact pixel position matching targetX */}
            <div
              className="w-full h-full relative"
              style={{
                clipPath: PUZZLE_PIECE_CLIP_PATH,
                backgroundImage: `url(${currentScene.imageUrl})`,
                backgroundSize: `${containerWidth}px ${containerHeight}px`,
                backgroundPosition: `-${targetX}px -${targetY}px`,
              }}
            >
              {/* Highlight rim border inside the piece */}
              <div
                className={`absolute inset-0 border-2 transition-colors ${
                  status === 'success'
                    ? 'border-emerald-400 bg-emerald-400/25'
                    : status === 'failed'
                    ? 'border-rose-400 bg-rose-400/25'
                    : isAligned
                    ? 'border-emerald-400 bg-emerald-400/15'
                    : isNear
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-white/90 bg-white/10'
                }`}
                style={{ clipPath: PUZZLE_PIECE_CLIP_PATH }}
              />
            </div>
          </div>

          {/* Success Overlay Flash */}
          {status === 'success' && (
            <div className="absolute inset-0 bg-emerald-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5 text-emerald-200 font-bold text-sm animate-fadeIn pointer-events-none z-20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
              <span className="tracking-wide text-white text-base">Human Verified!</span>
            </div>
          )}

          {/* Switch / Refresh scene button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              initNewPuzzle();
            }}
            className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-sm transition-all shadow-md active:scale-95 group/btn z-10"
            title="Switch puzzle scene (4 available)"
            aria-label="Switch puzzle scene"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Feedback message */}
        {errorMessage ? (
          <div className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 font-semibold mb-2.5 px-1 animate-shake">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5 px-1 font-medium">
            <span>
              {isAligned ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Release to verify!</span>
              ) : isNear ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Almost there...</span>
              ) : (
                'Drag slider or piece to slot'
              )}
            </span>
            <span className="font-mono-num text-[11px] text-purple-600 dark:text-purple-300 font-semibold">
              {sliderValue}%
            </span>
          </div>
        )}

        {/* Interactive Slider Track */}
        <div className="relative mb-3.5">
          <input
            id="puzzle-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={sliderValue}
            onChange={handleSliderChange}
            onMouseUp={handleVerify}
            onTouchEnd={handleVerify}
            onPointerUp={handleVerify}
            disabled={status === 'success'}
            className="w-full h-11 appearance-none bg-slate-100 dark:bg-[#090C16] border border-slate-300 dark:border-white/10 rounded-2xl cursor-pointer outline-none transition-all px-1
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-9 [&::-webkit-slider-thumb]:rounded-xl [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-fuchsia-600 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50 [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(147,51,234,0.4)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
            aria-label="Puzzle verification slider"
          />

          {/* Track hint label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wide">
            {status === 'success' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            ) : isAligned ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Release to verify!</span>
            ) : (
              <span>Slide right to match slot &rarr;</span>
            )}
          </div>
        </div>

        {/* Dev Mode quick verify */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Dev Mode Active
          </span>
          <button
            type="button"
            onClick={handleDevQuickVerify}
            className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-100 dark:hover:bg-purple-500/25 active:scale-95 transition-all"
          >
            ⚡ Quick Verify (Dev)
          </button>
        </div>
      </div>
    </div>
  );
};
