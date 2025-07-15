import { Form, FormInstance, Input, Select } from 'antd';
import BasicStepForm from '../../../components/My Components/StepForm/BasicStepForm';
import React, { useEffect } from 'react';
import axiosInstance from '../../../services/AxiosInstance';
import { useParams } from 'react-router-dom';

type StepProps = {
  current: number;
  setCurrent: (current: number) => void;
};

const onLoadDataFetch = async (
  productId: string,
  formRef: React.RefObject<FormInstance<any> | null>
) => {
  const url = `Product/GetProductWithVariants/${productId}`;
  try {
    const resp = await axiosInstance.get(url);
    const productData = await resp.data;
    formRef.current?.setFieldsValue(productData);
  } catch (ex) {
    console.log(ex);
  }
};

const ProductStep: React.FC<StepProps> = ({ current, setCurrent }) => {
  const { id } = useParams();
  const formRef = React.useRef<FormInstance>(null);

  useEffect(() => {
    if (id) {
      onLoadDataFetch(id, formRef);
    }
  }, [id]);
  return (
    <BasicStepForm current={current} setCurrent={setCurrent} APIURL={'Product'}>
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Barcode" name="barcode">
        <Input />
      </Form.Item>
      <Form.Item name="hasVariants" hidden>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) =>
          !getFieldValue('hasVariants') ? (
            <>
              <Form.Item label="Cost Price" name="costPrice">
                <Input type="number" />
              </Form.Item>
              <Form.Item label="Retail Price" name="retailPrice">
                <Input type="number" />
              </Form.Item>
              <Form.Item label="Wholesale Price" name="wholesalePrice">
                <Input type="number" />
              </Form.Item>
            </>
          ) : null
        }
      </Form.Item>

      <Form.Item label="Category" name="categoryId">
        <Select
          options={[
            { value: 'Category 1', label: 'Category 1' },
            { value: 'Category 2', label: 'Category 2' },
            { value: 'Category 3', label: 'Category 3' },
            { value: 'Category 4', label: 'Category 4' },
          ]}
        />
      </Form.Item>

      <Form.Item label="CreatedUserId" name="createdUserId" hidden>
        <Input readOnly />
      </Form.Item>
    </BasicStepForm>
  );
};

export default ProductStep;
