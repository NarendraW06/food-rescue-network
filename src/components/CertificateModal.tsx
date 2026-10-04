import React, { useRef, useEffect } from 'react';
import { X, Download, Printer, Award, CheckCircle2 } from 'lucide-react';
import type { Certificate } from '../types';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!certificate || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render Canvas Certificate (Width 1000px, Height 700px)
    canvas.width = 1000;
    canvas.height = 700;

    // Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1000, 700);
    bgGradient.addColorStop(0, '#0f172a'); // slate-900
    bgGradient.addColorStop(0.5, '#1e293b'); // slate-800
    bgGradient.addColorStop(1, '#022c22'); // dark emerald accent
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1000, 700);

    // Decorative Outer Border
    ctx.strokeStyle = '#10b981'; // emerald-500
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 940, 640);

    // Inner Gold Accent Border
    ctx.strokeStyle = '#f59e0b'; // amber-500
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 916, 616);

    // Header Title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOOD RESCUE NETWORK • OFFICIAL APPRECIATION CERTIFICATE', 500, 110);

    // Certificate Main Heading
    ctx.fillStyle = '#ffffff';
    ctx.font = 'extrabold 42px system-ui, sans-serif';
    ctx.fillText('CERTIFICATE OF APPRECIATION', 500, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('THIS HONOR IS PROUDLY PRESENTED TO', 500, 240);

    // Donor Name
    ctx.fillStyle = '#38bdf8'; // sky-400
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText(certificate.donorName, 500, 310);

    // Line Divider under name
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 330);
    ctx.lineTo(700, 330);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText(
      `In recognition of exceptional dedication to community food security and sustainability by completing`,
      500,
      390
    );

    // Milestone Badge text
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText(`★ ${certificate.milestoneTitle} ★`, 500, 440);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(
      `Preventing food waste, feeding neighbors in need, and fostering a zero-hunger future.`,
      500,
      485
    );

    // Footer Info
    const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Left Signature
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Elena Rostova', 120, 580);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Director, Food Rescue Network', 120, 602);
    ctx.fillText(`Issued: ${formattedDate}`, 120, 624);

    // Right Verification Code & Stamp
    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981';
    ctx.font = 'mono 14px monospace';
    ctx.fillText(`VERIFIED ID: ${certificate.certificateCode}`, 880, 580);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Authenticated via Food Rescue Network Registry', 880, 602);

    // Center Gold Seal Graphic
    ctx.save();
    ctx.beginPath();
    ctx.arc(500, 585, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL', 500, 582);
    ctx.fillText('SEAL', 500, 598);
    ctx.restore();

  }, [certificate]);

  if (!certificate) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Certificate-${certificate.certificateCode}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head><title>Appreciation Certificate - ${certificate.certificateCode}</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#0f172a;">
            <img src="${dataUrl}" style="max-width:100%; max-height:100%; border:4px solid #10b981;" />
          </body>
        </html>
      `);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Appreciation Certificate</h3>
              <p className="text-xs text-slate-400">Issued for Food Rescue Milestone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display */}
        <div className="p-6 flex flex-col items-center overflow-x-auto bg-slate-950/50">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[900px] h-auto border-2 border-slate-700 rounded-xl shadow-2xl"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Official Digital Verification Code: {certificate.certificateCode}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Image (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
