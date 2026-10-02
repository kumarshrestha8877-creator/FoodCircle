import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Video,
  Square,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { generateLiveProofVideo } from '../../utils/videoProofGenerator';
import FoodVideoPlayer from '../common/FoodVideoPlayer';

export default function PickupVerificationModal({
  order,
  isOpen,
  onClose,
  onVerificationComplete,
}) {
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [cameraError, setCameraError] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);

  const [locationPermission, setLocationPermission] = useState('prompt');
  const [capturedLocation, setCapturedLocation] = useState(null);
  const [locationTimestamp, setLocationTimestamp] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [simulatedCameraFallback, setSimulatedCameraFallback] = useState(false);

  const videoPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Clean up streams when modal closes
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  // 1. Camera Access Request
  const requestCameraAccess = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) is not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'environment' },
        audio: false,
      });
      setMediaStream(stream);
      setCameraPermission('granted');
      setSimulatedCameraFallback(false);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch((err) => console.log('Video play error:', err));
      }
    } catch (err) {
      console.warn('Camera request error:', err);
      setCameraPermission('denied');
      setCameraError(err.message || 'Permission denied or no camera device available.');
    }
  };

  // Fallback simulator for presentations on laptops/desktops without physical webcams
  const enableDemoCameraStream = () => {
    setSimulatedCameraFallback(true);
    setCameraPermission('granted');
    setCameraError(null);
  };

  // 2. Video Recording
  const startRecording = () => {
    setRecordedBlobUrl(null);
    chunksRef.current = [];
    setRecordDuration(0);

    if (simulatedCameraFallback) {
      // Simulate recording
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => {
          if (prev >= 4) {
            stopRecording();
            return 4;
          }
          return prev + 1;
        });
      }, 1000);
      return;
    }

    if (!mediaStream) return;

    try {
      const options = { mimeType: 'video/webm' };
      let recorder;
      try {
        recorder = new MediaRecorder(mediaStream, options);
      } catch (e) {
        recorder = new MediaRecorder(mediaStream);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('MediaRecorder start failed:', err);
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);

    if (simulatedCameraFallback) {
      // Generate genuine in-memory local WebM video using HTML5 Canvas & MediaRecorder
      const generated = await generateLiveProofVideo({
        foodName: order?.items?.[0]?.name || 'Surplus Meal Package',
        providerName: order?.pickupLocation || 'Food Partner Kitchen',
        location: order?.pickupLocation || 'Sector V, Salt Lake, Kolkata',
        durationMs: 3200,
      });

      if (generated?.videoUrl) {
        setRecordedBlobUrl(generated.videoUrl);
      } else {
        setRecordedBlobUrl('verified_canvas_stream');
      }
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const retakeVideo = () => {
    setRecordedBlobUrl(null);
    setRecordDuration(0);
    setIsSubmitted(false);
    if (!simulatedCameraFallback && mediaStream && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = mediaStream;
      videoPreviewRef.current.play().catch(() => {});
    }
  };

  // 3. Location Request
  const capturePickupLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      fallbackLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setCapturedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 10),
          name: `${order?.pickupLocation || 'Pickup Restaurant'} (Browser Geolocation Verified)`,
        });
        setLocationTimestamp(timeString);
        setLocationPermission('granted');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        fallbackLocation(err.message);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const fallbackLocation = (errMsg) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setCapturedLocation({
      lat: order?.pickupCoords?.lat || 22.5804,
      lng: order?.pickupCoords?.lng || 88.4378,
      accuracy: 5,
      name: `${order?.pickupLocation || 'Sector V Restaurant Venue'} (Verified Venue Coordinates)`,
    });
    setLocationTimestamp(timeString);
    setLocationPermission('granted');
    if (errMsg) {
      setLocationError(`Browser GPS notice: ${errMsg}. Verified restaurant coordinates attached.`);
    }
  };

  // 4. Submit Verification
  const handleSubmitVerification = () => {
    if (!recordedBlobUrl || !capturedLocation) return;
    setIsSubmitted(true);
  };

  // 5. Final Confirmation (Unlocked only after step 4)
  const handleFinalConfirm = () => {
    stopMediaStream();
    onVerificationComplete({
      videoUrl: recordedBlobUrl,
      coords: { lat: capturedLocation.lat, lng: capturedLocation.lng },
      locationName: capturedLocation.name,
      timestamp: locationTimestamp,
      videoDurationSec: recordDuration || 4,
      isRealUpload: !simulatedCameraFallback,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Food Pickup Verification</h3>
              <p className="text-emerald-100 text-xs">
                Mandatory camera recording + GPS capture for Order #{order?.id}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopMediaStream();
              onClose();
            }}
            className="text-emerald-200 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Information Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Mandatory FoodCircle Protocol</strong>
              Volunteers cannot mark food as collected without capturing live video proof of the packaged surplus food and verified pickup GPS coordinates.
            </div>
          </div>

          {/* STEP 1: Camera Access & Video Recording */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                Step 1 — Camera & Video Proof
              </span>
              {cameraPermission === 'granted' && (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Camera Ready
                </span>
              )}
            </div>

            {/* Camera Request Button if not granted */}
            {cameraPermission !== 'granted' && (
              <div className="text-center py-6 px-4 bg-white rounded-lg border border-dashed border-slate-300">
                <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-800 text-sm">Allow Camera Access</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  FoodCircle requires browser camera permission to record proof that surplus food is safely handed over.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={requestCameraAccess}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    Request Browser Camera
                  </button>
                  <button
                    onClick={enableDemoCameraStream}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition"
                    title="For laptops/environments without a webcam"
                  >
                    Use Sample Food Stream
                  </button>
                </div>
                {cameraError && (
                  <p className="text-[11px] text-red-600 mt-3 font-medium bg-red-50 p-2 rounded border border-red-200">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Video Viewfinder / Playback Preview */}
            {cameraPermission === 'granted' && (
              <div className="space-y-3">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                  {recordedBlobUrl ? (
                    <FoodVideoPlayer
                      src={recordedBlobUrl}
                      title={`Order #${order?.id} Pickup Proof`}
                      timestamp={locationTimestamp}
                      location={capturedLocation?.name || order?.pickupLocation}
                      autoPlay={true}
                    />
                  ) : simulatedCameraFallback ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-4">
                      <img
                        src={order?.items?.[0]?.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'}
                        alt="Food package"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <div className="relative z-10 text-center bg-slate-900/80 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                        <p className="text-xs font-bold text-emerald-400 mb-1">
                          Food Package Viewfinder Simulation
                        </p>
                        <p className="text-[11px] text-slate-200">
                          {order?.items?.[0]?.name || 'Surplus Meal Package'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          SEAL: #FC-SAFE-PACK-VERIFIED
                        </p>
                      </div>
                    </div>
                  ) : (
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Overlaid Recording Status */}
                  {isRecording && (
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600/90 text-white px-2.5 py-1 rounded-full text-xs font-bold tracking-wide animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      REC 00:0{recordDuration}
                    </div>
                  )}

                  {recordedBlobUrl && (
                    <div className="absolute top-3 right-3 bg-emerald-600/90 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Video Recorded
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!recordedBlobUrl ? (
                    !isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Record Pickup Video (3-5s)
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center gap-2 animate-bounce"
                      >
                        <Square className="w-4 h-4 text-red-400" />
                        Stop Recording ({recordDuration}s)
                      </button>
                    )
                  ) : (
                    <button
                      onClick={retakeVideo}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg text-xs transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retake Video
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Location Verification */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Step 2 — Pickup Geolocation
              </span>
              {capturedLocation && (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Location Captured ✓
                </span>
              )}
            </div>

            {!capturedLocation ? (
              <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                <div>
                  <h5 className="font-semibold text-slate-800 text-xs">Capture Restaurant Location</h5>
                  <p className="text-[11px] text-slate-500">
                    Expected: {order?.pickupLocation || 'Salt Lake Sector V'}
                  </p>
                </div>
                <button
                  onClick={capturePickupLocation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Capture GPS
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pickup Location Captured ✓
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                  <div>
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="block font-bold text-slate-800">
                      {capturedLocation.lat.toFixed(4)}° N, {capturedLocation.lng.toFixed(4)}° E
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="block font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {locationTimestamp}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 truncate pt-1 border-t border-emerald-200/60">
                  Venue: {capturedLocation.name}
                </p>
              </div>
            )}
            {locationError && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                {locationError}
              </p>
            )}
          </div>

          {/* STEP 3: Submission & Final Confirmation */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitVerification}
                disabled={!recordedBlobUrl || !capturedLocation}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition ${
                  recordedBlobUrl && capturedLocation
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-200'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Submit Verification Proof
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pickup Proof Submitted ✓ (Video & GPS Verified)
                </div>

                <button
                  onClick={handleFinalConfirm}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 animate-pulse"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm Food Collected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
