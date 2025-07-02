import { Form, Input, Select } from 'antd';
import BasicStepForm from '../../../components/My Components/StepForm/BasicStepForm';

type StepProps = {
  current: number;
  setCurrent: (current: number) => void;
};
const ProductStep: React.FC<StepProps> = ({ current, setCurrent }) => {
  return (
    <BasicStepForm current={current} setCurrent={setCurrent} APIURL={'Product'}>
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Barcode" name="barcode">
        <Input />
      </Form.Item>

      <Form.Item label="Cost Price" name="costPrice">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Retail Price" name="retailPrice">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Wholesale Price" name="wholesalePrice">
        <Input type="number" />
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
