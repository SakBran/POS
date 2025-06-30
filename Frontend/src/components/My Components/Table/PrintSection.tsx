import { AnyObject } from 'antd/es/_util/type';
import React from 'react';
interface Props {
  printRef: React.RefObject<HTMLDivElement | null>;
  dataList: AnyObject[];
  invoiceNo: string;
  invoiceDate: string;
  total: number;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  paid: number | null;
  balance: number | null;
}

export interface SaleDetail {
  id: string;
  saleId: string;
  productId: string;
  name: string;
  unitId: string | number;
  quantity: number;
  quantityInBase: number;
  unitPrice: number;
  total: number;
  remarks: string | null;
  storeId: string | null;
  storeName: string | null;
  rootUserId: string;
}

const PrintSection = ({
  printRef,
  dataList,
  invoiceNo,
  invoiceDate,
  total,
  subTotal,
  deliveryFee,
  discount,
  tax,
  paid,
  balance,
}: Props) => {
  return (
    <div ref={printRef} style={{ display: 'none' }}>
      <div className="receipt">
        <div className="center bold">My Store</div>
        <div className="center">Yangon, Myanmar</div>
        <div className="center">Tel: 09-123456789</div>
        <hr />
        <div>Invoice #: {invoiceNo}</div>
        <div>Date: {invoiceDate}</div>
        <hr />
        {dataList.map((data: any, index) => {
          const item: SaleDetail = JSON.parse(JSON.stringify(data));
          return (
            <div key={index} className="item">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{item.unitPrice} MMK</span>
            </div>
          );
        })}

        <hr />

        <div className="item bold">
          <span>Sub Total</span>
          <span>{subTotal} MMK</span>
        </div>

        <div className="item bold">
          <span>Discount</span>
          <span>{discount} MMK</span>
        </div>

        <div className="item bold">
          <span>Tax</span>
          <span>{tax} MMK</span>
        </div>

        <div className="item bold">
          <span>Delivery Fee</span>
          <span>{deliveryFee} MMK</span>
        </div>
        <hr />

        <div className="item bold">
          <span>Total</span>
          <span>{total} MMK</span>
        </div>

        <hr />
        <div className="item bold">
          <span>Paid</span>
          <span>{paid} MMK</span>
        </div>

        <div className="item bold">
          <span>Left</span>
          <span>{balance} MMK</span>
        </div>

        <hr />
        <div className="center">Thank you for using Yumi free POS!</div>
        <div className="center" style={{ paddingTop: 5 }}>
          https://sakbran.github.io
        </div>
      </div>
    </div>
  );
};

export default PrintSection;
