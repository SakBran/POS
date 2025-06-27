import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';

// TypeScript declaration for BarcodeDetector
declare global {
  interface Window {
    BarcodeDetector?: typeof BarcodeDetector;
  }

  interface BarcodeDetector {
    detect(video: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
  }

  var BarcodeDetector: {
    new (options?: { formats?: string[] }): BarcodeDetector;
  };
}

interface Props {
  isModalOpenForBarcode: boolean;
  setIsModalOpenForBarcode: React.Dispatch<React.SetStateAction<boolean>>;
}
const BarcodeScannerModal: React.FC<Props> = ({
  isModalOpenForBarcode,
  setIsModalOpenForBarcode,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const barcodeDetector = useRef<BarcodeDetector | null>(null);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize scanner when modal opens
  useEffect(() => {
    if (isModalOpenForBarcode) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => stopScanner(); // Clean up on unmount
  }, [isModalOpenForBarcode]);

  // Start camera and barcode scanning
  const startScanner = async () => {
    try {
      // Access camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Barcode detector
      if ('BarcodeDetector' in window) {
        barcodeDetector.current = new window.BarcodeDetector({
          formats: ['qr_code', 'code_128'],
        });

        scanInterval.current = setInterval(async () => {
          try {
            if (videoRef.current) {
              if (barcodeDetector.current) {
                const detections = await barcodeDetector.current.detect(
                  videoRef.current
                );
                if (detections.length > 0) {
                  console.log('Detected barcode:', detections[0].rawValue);
                  alert(`Detected: ${detections[0].rawValue}`);
                  setIsModalOpenForBarcode(false);
                  stopScanner();
                }
              }
            }
          } catch (err) {
            console.error('Barcode detection error:', err);
          }
        }, 500);
      } else {
        console.warn('BarcodeDetector is not supported in this browser.');
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
  };

  return (
    <Modal
      title="Add Product With QR/Barcode Modal"
      open={isModalOpenForBarcode}
      onOk={() => setIsModalOpenForBarcode(false)}
      onCancel={() => setIsModalOpenForBarcode(false)}
    >
      <div style={{ textAlign: 'center' }}>
        <video ref={videoRef} style={{ width: '100%', maxHeight: 400 }} />
      </div>
    </Modal>
  );
};

export default BarcodeScannerModal;
