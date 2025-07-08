import { Button, Form, FormInstance, Input, InputNumber, Space } from 'antd';
import BasicStepForm from '../../../components/My Components/StepForm/BasicStepForm';
import { useEffect } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../services/AxiosInstance';

type StepProps = {
  current: number;
  setCurrent: (current: number) => void;
};

export interface UnitDto {
  unitName: string;
  quantityInBaseUnit: number;
  price: number;
}

export interface ProductUnitCreateWrapperDto {
  units: UnitDto[];
}

const UnitStep: React.FC<StepProps> = ({ current, setCurrent }) => {
  const { id } = useParams();
  const onLoadDataFetch = async (productId: string) => {
    const url = `Product/GetProductWithUnits/${productId}`;
    try {
      const resp = await axiosInstance.get(url);
      const productData: ProductUnitCreateWrapperDto = await resp.data;
      formRef.current?.setFieldsValue({
        units: productData.units || [],
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleAddRequest = async (productId: string, values: unknown) => {
    const url = `Product/Units/${productId}`;
    try {
      const resp = await axiosInstance.put(url, values);
      const productData = await resp.data;
      formRef.current?.setFieldsValue({ productData });
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    if (id) {
      onLoadDataFetch(id);
    }
  }, [id]);

  const formRef = React.useRef<FormInstance>(null);

  const onFinish = (values: unknown) => {
    if (id) {
      handleAddRequest(id, values);
    }
    console.log(values);
  };

  return (
    <BasicStepForm
      onFinishCustomize={onFinish}
      current={current}
      setCurrent={setCurrent}
      formRefUserDefined={formRef}
      APIURL="Product"
      finalStep={true}
    >
      <Form.List name="units">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="start"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'unitName']}
                  rules={[{ required: true, message: 'Enter unit name' }]}
                >
                  <Input placeholder="Unit Name (e.g., Box, Dozen)" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'quantityInBaseUnit']}
                  rules={[{ required: true, message: 'Enter quantity' }]}
                >
                  <InputNumber placeholder="Quantity" min={1} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'price']}
                  rules={[{ required: true, message: 'Enter price' }]}
                >
                  <InputNumber placeholder="Price" min={0} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Unit
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </BasicStepForm>
  );
};

export default UnitStep;
