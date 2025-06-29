import { Col, Form, FormInstance, Input, Modal, Row, Select } from 'antd';
import BasicForm from '../Form/BasicForm';
import useFormActions from '../../../hooks/useFormActions';
import useFormhelper from '../../../hooks/useFormhelper';
import { useEffect, useState } from 'react';
import React from 'react';
import { Sale } from './NewsaleTable';
import axiosInstance from '../../../services/AxiosInstance';
interface Props {
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (value: React.SetStateAction<boolean>) => void;
  isPaid: boolean;
  setIsPaid: (value: React.SetStateAction<boolean>) => void;
  subTotal: number;
  setSale: (value: React.SetStateAction<Sale>) => void;
}
const APIURL = 'RetailSales/PaymentRecord';
const PaymentModal = ({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  isPaid,
  setIsPaid,
  subTotal,
  setSale,
}: Props) => {
  const { readOnly, id } = useFormhelper();
  const formRef = React.useRef<FormInstance>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const modifiedOnFinish = (value: unknown) => {
    setLoading(true);
    try {
      // onFinish(value);
      const Task = async () => {
        const response = await axiosInstance.put(APIURL + '/' + id, value);
        const temp = await response.data;
        const saleData: Sale = JSON.parse(JSON.stringify(temp));
        setSale(saleData);
        setIsPaid(true);
        setLoading(false);
        setIsPaymentModalOpen(false);
      };
      Task();
    } catch (ex) {
      console.log(ex);
      setLoading(false);
      setIsPaymentModalOpen(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    formRef.current?.setFieldValue('subtotal', +subTotal);
    formRef.current?.setFieldValue('voucherNumber', id);
    formRef.current?.setFieldValue('paymentMethod', 'cash');
    formRef.current?.setFieldValue('discount', 0);
    formRef.current?.setFieldValue('amountPaid', 0);
    formRef.current?.setFieldValue(
      'saleDate',
      new Date().toISOString().slice(0, 10)
    );
    totalHandler();
  }, [isPaymentModalOpen]);

  const totalHandler = () => {
    const subTotal = +formRef.current?.getFieldValue('subtotal') || 0;
    const tax = +formRef.current?.getFieldValue('tax') || 0;
    const deliveryFee = +formRef.current?.getFieldValue('deliveryFees') || 0;
    const discount = formRef.current?.getFieldValue('discount') || 0;

    let discountValue = 0;
    let total = 0;

    if (typeof discount === 'string' && discount.includes('%')) {
      discountValue = parseFloat(discount.replace('%', '')) || 0;
      console.log((subTotal * discountValue) / 100);
      total = subTotal + tax + deliveryFee - (subTotal * discountValue) / 100;
      formRef.current?.setFieldValue('discountType', 'Percentage');
    } else {
      discountValue = parseFloat(discount) || 0;
      total = subTotal + tax + deliveryFee - discountValue;
      formRef.current?.setFieldValue('discountType', 'Fixed');
    }

    formRef.current?.setFieldValue('total', total);
    setLoading(false);
  };

  const balance = () => {
    const Total = +formRef.current?.getFieldValue('total');
    const Paid = +formRef.current?.getFieldValue('amountPaid');
    const balance = Total - Paid;
    formRef.current?.setFieldValue('balance', balance);
  };
  return (
    <Modal
      width={{
        xs: '100%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }}
      title="Payment"
      open={isPaymentModalOpen} // Change to a state variable like isFixQuantityModalOpen when integrating
      onOk={() => {
        formRef.current?.submit();
      }}
      onCancel={() => {
        setIsPaymentModalOpen(false);
      }}
    >
      <BasicForm
        formRef={formRef}
        onFinish={modifiedOnFinish}
        readOnly={loading || readOnly}
        loading={loading}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="SaleDate" name="saleDate">
              <Input type="date" readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="VoucherNumber" name="voucherNumber">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Subtotal" name="subtotal">
              <Input type="number" readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Discount Type" name="discountType">
              <Select
                placeholder="Select payment method"
                onChange={(e) => {
                  if (
                    formRef.current?.getFieldValue('discountType') === 'Fixed'
                  ) {
                    var temp = formRef.current?.getFieldValue('discount');
                    formRef.current.setFieldValue(
                      'discount',
                      temp.replace('%', '')
                    );
                  }
                  if (
                    formRef.current?.getFieldValue('discountType') ===
                    'Percentage'
                  ) {
                    var temp = formRef.current?.getFieldValue('discount');
                    if (+temp > 100) {
                      formRef.current.setFieldValue('discount', '99%');
                      totalHandler();
                    } else {
                      formRef.current.setFieldValue('discount', temp + '%');
                      totalHandler();
                    }
                  }
                }}
              >
                <Select.Option value="Fixed">Fixed Amount</Select.Option>
                <Select.Option value="Percentage">Percentage (%)</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Discount" name="discount">
              <Input
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9%]/g, '');
                  const discountType =
                    formRef.current?.getFieldValue('discountType');
                  if (discountType === 'Percentage') {
                    // Remove % for checking numeric value
                    const numericValue =
                      parseFloat(value.replace('%', '')) || 0;
                    if (numericValue > 100) {
                      value = '100%';
                    } else if (value.includes('%')) {
                      value = `${numericValue}%`;
                    }
                  }
                  formRef.current?.setFieldValue('discount', value);
                  totalHandler();
                }}
                value={formRef.current?.getFieldValue('discount')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Tax" name="tax">
              <Input type="number" onChange={totalHandler} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Delivery Fee" name="deliveryFees">
              <Input type="number" onChange={totalHandler} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Total" name="total">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="AmountPaid" name="amountPaid">
              <Input type="number" onChange={balance} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="ပေးရန်ကျန်" name="balance">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="PaymentMethod" name="paymentMethod">
              <Select placeholder="Select payment method">
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="card">Card</Select.Option>
                <Select.Option value="mobile">Mobile Payment</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </BasicForm>
    </Modal>
  );
};

export default PaymentModal;
