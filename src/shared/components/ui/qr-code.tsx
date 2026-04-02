// src/components/ui/qr-code.tsx
import React from 'react';
// @ts-expect-error wrong types in react-qr-code
import { QRCode as QRCodeSVG } from 'react-qr-code';
import { cn } from '@shared/lib/utils';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  /** A React node (SVG, img, icon) to overlay at the center of the QR code */
  logo?: React.ReactNode;
  /** Size of the logo container (px). Defaults to ~22% of QR size */
  logoSize?: number;
  /** Background color behind the logo. Defaults to white */
  logoBg?: string;
  /** Border radius of the logo container. Defaults to '4px' */
  logoRadius?: string;
}

export function QRCode({
  value,
  size = 140,
  className,
  logo,
  logoSize,
  logoBg = 'white',
  logoRadius = '4px',
}: QRCodeProps) {
  const resolvedLogoSize = logoSize ?? Math.round(size * 0.22);
  const padding = 3;

  return (
    <div className={cn('bg-white p-1 rounded-md inline-block relative', className)}>
      <QRCodeSVG value={value} size={size} />
      {logo && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: resolvedLogoSize + padding * 2,
            height: resolvedLogoSize + padding * 2,
            background: logoBg,
            borderRadius: logoRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding,
          }}
        >
          <div style={{ width: resolvedLogoSize, height: resolvedLogoSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {logo}
          </div>
        </div>
      )}
    </div>
  );
}



