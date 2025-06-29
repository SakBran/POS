import React from 'react';
interface Props {
  printRef: React.RefObject<HTMLDivElement | null>;
}
const PrintSection = ({ printRef }: Props) => {
  return (
    <div ref={printRef} style={{ display: 'none' }}>
      <div className="receipt">
        <div className="center bold">My Store</div>
        <div className="center">Yangon, Myanmar</div>
        <div className="center">Tel: 09-123456789</div>
        <hr />
        <div>Invoice #: 00123</div>
        <div>Date: 2025-06-29</div>
        <hr />
        <div className="item">
          <span>Item A x2</span>
          <span>2000 MMK</span>
        </div>
        <div className="item">
          <span>Item B x1</span>
          <span>1000 MMK</span>
        </div>
        <div className="item">
          <span>Item C x3</span>
          <span>4500 MMK</span>
        </div>
        <hr />
        <div className="item bold">
          <span>Total</span>
          <span>7500 MMK</span>
        </div>
        <hr />
        <div className="center">Thank you!</div>
      </div>
    </div>
  );
};

export default PrintSection;
