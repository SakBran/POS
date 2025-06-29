import { Col, Form, FormInstance, Input, Modal, Row, Select } from 'antd';
import BasicForm from '../Form/BasicForm';
import useFormActions from '../../../hooks/useFormActions';
import useFormhelper from '../../../hooks/useFormhelper';
import { useEffect, useState } from 'react';
import React from 'react';
interface Props {
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (value: React.SetStateAction<boolean>) => void;
  subTotal: number;
}
const APIURL = '';
const PaymentModal = ({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  subTotal,
}: Props) => {
  const { readOnly, id, action } = useFormhelper();
  const formRef = React.useRef<FormInstance>(null);
  const { onFinish, writeLoading } = useFormActions(id, action, APIURL);
  const [loading, setLoading] = useState<boolean>(false);
  const modifiedOnFinish = (value: unknown) => {
    onFinish(value);
  };
  useEffect(() => {
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
    } else {
      discountValue = parseFloat(discount) || 0;
      total = subTotal + tax + deliveryFee - discountValue;
    }

    formRef.current?.setFieldValue('total', total);
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
        readOnly={loading || writeLoading || readOnly}
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
            <Form.Item label="Discount" name="discount">
              <Input onChange={totalHandler} />
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
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="ပေးရန်ကျန်" name="debt">
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
