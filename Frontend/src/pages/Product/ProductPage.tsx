import { Form, Input, Select } from 'antd';
import { PageHeader } from '../../components';
import { AjaxButton } from '../../components/My Components/AjaxButton/AjaxButton';
import BasicForm from '../../components/My Components/Form/BasicForm';
import useFormActions from '../../hooks/useFormActions';
import useFormhelper from '../../hooks/useFormhelper';
import useFormLoad from '../../hooks/useFormload';
import { useEffect } from 'react';

const APIURL = 'Product';

const ProductPage = () => {
  const { readOnly, id, action } = useFormhelper();
  const { formRef, loading } = useFormLoad(id, action, APIURL);
  const { onFinish, writeLoading } = useFormActions(id, action, APIURL);
  const userId = localStorage.getItem('userid');
  useEffect(() => {
    formRef.current?.setFieldValue('createdUserId', userId);
  }, [userId]);

  return (
    <>
      <PageHeader title="Product Form" />
      <BasicForm
        formRef={formRef}
        onFinish={onFinish}
        readOnly={loading || writeLoading || readOnly}
        loading={loading}
      >
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

        <Form.Item>
          <AjaxButton writeLoading={writeLoading} action={action} />
        </Form.Item>
      </BasicForm>
    </>
  );
};

export default ProductPage;
