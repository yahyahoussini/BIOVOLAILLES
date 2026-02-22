import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Printer, Egg } from "lucide-react";

interface BatchCertificateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: {
    batch_ref: string;
    quantity_eggs: number;
    grade: string | null;
    package_date: string;
    flock?: { breed?: string; cooperative?: { name?: string } };
  } | null;
}

export function BatchCertificate({ open, onOpenChange, batch }: BatchCertificateProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (batch?.batch_ref) {
      const traceUrl = `${window.location.origin}/trace/${batch.batch_ref}`;
      QRCode.toDataURL(traceUrl, {
        width: 200,
        margin: 1,
        color: { dark: "#0a2e1a", light: "#ffffff" },
        errorCorrectionLevel: "H",
      }).then(setQrDataUrl);
    }
  }, [batch?.batch_ref]);

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `QR-${batch?.batch_ref}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrintPDF = () => {
    if (!certRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificat ${batch?.batch_ref}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: white; }
            .cert { max-width: 700px; margin: 0 auto; padding: 40px; }
            .header { text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 24px; margin-bottom: 32px; }
            .logo-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
            .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #c9a84c, #d4b76a); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
            .brand { font-family: 'Playfair Display', serif; font-size: 28px; color: #0a2e1a; font-weight: 700; }
            .subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; font-weight: 600; }
            .cert-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #0a2e1a; text-align: center; margin-bottom: 32px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
            .detail { background: #f8f7f4; border-radius: 12px; padding: 16px; border-left: 3px solid #c9a84c; }
            .detail-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
            .detail-value { font-size: 16px; font-weight: 600; color: #0a2e1a; }
            .qr-section { text-align: center; padding: 24px; background: #f8f7f4; border-radius: 16px; margin-bottom: 24px; }
            .qr-section img { margin: 0 auto 12px; }
            .qr-label { font-size: 11px; color: #888; }
            .footer { text-align: center; font-size: 10px; color: #aaa; border-top: 1px solid #eee; padding-top: 16px; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="cert">
            <div class="header">
              <div class="logo-row">
                <div class="logo-icon">🥚</div>
                <div class="brand">BIOVOLAILLES</div>
              </div>
              <div class="subtitle">Union Trace — Certificat de Traçabilité</div>
            </div>
            <div class="cert-title">Certificat de Lot N° ${batch?.batch_ref}</div>
            <div class="details">
              <div class="detail">
                <div class="detail-label">Référence du lot</div>
                <div class="detail-value">${batch?.batch_ref}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Coopérative</div>
                <div class="detail-value">${batch?.flock?.cooperative?.name || "—"}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Race</div>
                <div class="detail-value">${batch?.flock?.breed || "—"}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Quantité d'œufs</div>
                <div class="detail-value">${batch?.quantity_eggs}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Grade</div>
                <div class="detail-value">${batch?.grade || "—"}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Date de conditionnement</div>
                <div class="detail-value">${batch?.package_date}</div>
              </div>
            </div>
            <div class="qr-section">
              <img src="${qrDataUrl}" width="180" height="180" />
              <div class="qr-label">Scannez pour vérifier la traçabilité</div>
            </div>
            <div class="footer">
              BIOVOLAILLES UNION TRACE — Système de traçabilité certifié<br/>
              Document généré le ${new Date().toLocaleDateString("fr-FR")}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-gold max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Egg className="h-5 w-5 text-gold" /> Certificat — {batch.batch_ref}
          </DialogTitle>
        </DialogHeader>

        <div ref={certRef} className="space-y-5">
          {/* QR Code display */}
          <div className="flex flex-col items-center py-4">
            {qrDataUrl && (
              <div className="p-4 bg-white rounded-xl shadow-lg">
                <img src={qrDataUrl} alt="QR Code" className="w-44 h-44" />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Scannez pour accéder à la traçabilité complète
            </p>
          </div>

          {/* Batch details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Référence", value: batch.batch_ref },
              { label: "Coopérative", value: batch.flock?.cooperative?.name || "—" },
              { label: "Race", value: batch.flock?.breed || "—" },
              { label: "Œufs", value: String(batch.quantity_eggs) },
              { label: "Grade", value: batch.grade || "—" },
              { label: "Date", value: batch.package_date },
            ].map((d) => (
              <div key={d.label} className="bg-secondary/30 rounded-lg p-3 border-l-2 border-gold">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.label}</p>
                <p className="text-sm font-semibold text-foreground">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleDownloadPNG} variant="outline" className="flex-1 border-gold text-gold hover:bg-gold/10">
              <Download className="h-4 w-4 mr-2" /> PNG
            </Button>
            <Button onClick={handlePrintPDF} className="flex-1 gradient-gold text-primary-foreground font-semibold">
              <Printer className="h-4 w-4 mr-2" /> Imprimer PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
