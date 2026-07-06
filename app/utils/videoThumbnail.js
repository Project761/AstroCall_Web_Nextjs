/**
 * Capture a frame from a video file (Instagram-style auto thumbnail).
 * @param {File} videoFile
 * @param {{ seekSeconds?: number, maxWidth?: number, quality?: number }} options
 * @returns {Promise<{ blob: Blob, file: File, objectUrl: string } | null>}
 */
export async function captureVideoThumbnail(videoFile, options = {}) {
  if (!videoFile || !videoFile.type?.startsWith("video/")) return null;

  const { seekSeconds = 1, maxWidth = 720, quality = 0.85 } = options;

  return new Promise((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(videoFile);
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
      resolve(result);
    };

    const fail = () => finish(null);

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("crossOrigin", "anonymous");

    video.onerror = fail;

    video.onloadedmetadata = () => {
      const duration = Number(video.duration);
      const seek =
        Number.isFinite(duration) && duration > 0
          ? Math.min(Math.max(seekSeconds, 0.1), duration * 0.15)
          : seekSeconds;

      video.currentTime = seek;
    };

    video.onseeked = () => {
      try {
        const w = video.videoWidth || maxWidth;
        const h = video.videoHeight || maxWidth;
        if (!w || !h) {
          fail();
          return;
        }

        const scale = w > maxWidth ? maxWidth / w : 1;
        const cw = Math.round(w * scale);
        const ch = Math.round(h * scale);

        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          fail();
          return;
        }

        ctx.drawImage(video, 0, 0, cw, ch);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              fail();
              return;
            }
            const baseName = videoFile.name.replace(/\.[^.]+$/, "") || "reel";
            const file = new File([blob], `${baseName}-thumb.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            const objectUrl = URL.createObjectURL(blob);
            finish({ blob, file, objectUrl });
          },
          "image/jpeg",
          quality
        );
      } catch {
        fail();
      }
    };

    video.src = url;
  });
}
