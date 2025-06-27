import React, { useEffect, useRef, useCallback } from 'react';
import { Modal } from 'antd';
import { Html5Qrcode } from 'html5-qrcode';

export interface Html5DetectorModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onScan?: (decodedText: string) => void;
}

const Html5DetectorModal: React.FC<Html5DetectorModalProps> = ({
  isOpen,
  setIsOpen,
  onScan,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef<string>(
    `qr-reader-${crypto.randomUUID?.() ?? Date.now()}`
  );

  const stopScanner = useCallback(async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.stop();
    } catch {
      // ignore if already stopped
    } finally {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    const html5QrCode = new Html5Qrcode(readerIdRef.current);
    scannerRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then(async (devices) => {
        if (!devices.length) throw new Error('No camera devices found');
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            onScan?.(decodedText);
            setIsOpen(false);
            alert(decodedText);
          },
          (errorMessage: string) => {
            // Optionally handle scan errors here
            console.warn('QR scan error:', errorMessage);
          }
        );
      })
      .catch((err) => {
        console.error('Scanner error:', err);
        setIsOpen(false);
      });

    return () => {
      stopScanner();
    };
  }, [isOpen, onScan, setIsOpen, stopScanner]);

  return (
    <Modal
      title="Scan QR / Barcode"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <div id={readerIdRef.current} style={{ width: '100%' }} />
    </Modal>
  );
};

export default Html5DetectorModal;
