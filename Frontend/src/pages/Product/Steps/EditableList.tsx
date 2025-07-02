import React from 'react';
import { List, InputNumber, Button, Typography, Divider, Row, Col } from 'antd';

const { Text } = Typography;

export type Variant = {
  name: string;
  price: number;
  stock: number;
};

export type VariantGroup = {
  title: string;
  items: Variant[];
};

interface Props {
  variants: VariantGroup[];
  setVariants: React.Dispatch<React.SetStateAction<VariantGroup[]>>;
}

const VariantEditor = ({ variants, setVariants }: Props) => {
  // update single item
  const updateItem = (
    groupIndex: number,
    itemIndex: number,
    key: 'price' | 'stock',
    value: number
  ) => {
    const newData = [...variants];
    newData[groupIndex].items[itemIndex][key] = value;
    setVariants(newData);
  };

  // delete single item
  const handleDelete = (groupIndex: number, itemIndex: number) => {
    const newData = [...variants];
    newData[groupIndex].items.splice(itemIndex, 1);
    setVariants(newData);
  };

  // apply one price to all items in a group
  const applyAllPrice = (groupIndex: number, value: number = 0) => {
    const newData = [...variants];
    newData[groupIndex].items = newData[groupIndex].items.map((item) => ({
      ...item,
      price: value,
    }));
    setVariants(newData);
  };

  // apply one stock to all items in a group
  const applyAllStock = (groupIndex: number, value: number = 0) => {
    const newData = [...variants];
    newData[groupIndex].items = newData[groupIndex].items.map((item) => ({
      ...item,
      stock: value,
    }));
    setVariants(newData);
  };

  return (
    <>
      {variants.map((group, groupIndex) => (
        <div key={group.title} style={{ marginBottom: 24 }}>
          <Divider orientation="left">{group.title}</Divider>

          {/* “Apply to all” row */}
          <Row gutter={[8, 8]} style={{ padding: '0 16px', marginBottom: 8 }}>
            <Col xs={0} sm={8} />
            <Col xs={24} sm={6}>
              <InputNumber
                placeholder="All Price"
                addonBefore="MMK"
                style={{ width: '100%' }}
                onChange={(v) => applyAllPrice(groupIndex, Number(v) || 0)}
              />
            </Col>
            <Col xs={24} sm={6}>
              <InputNumber
                placeholder="All Stock"
                addonBefore="Qty"
                style={{ width: '100%' }}
                onChange={(v) => applyAllStock(groupIndex, Number(v) || 0)}
              />
            </Col>
            <Col xs={0} sm={4} />
          </Row>

          {/* Header row */}
          <Row
            style={{
              padding: '8px 16px',
              fontWeight: 'bold',
              backgroundColor: '#fafafa',
            }}
            gutter={16}
          >
            <Col xs={0} sm={8}>
              Variant
            </Col>
            <Col xs={0} sm={6}>
              Price
            </Col>
            <Col xs={0} sm={6}>
              Stock
            </Col>
            <Col xs={0} sm={4} />
          </Row>

          {/* Variant list */}
          <List
            bordered
            dataSource={group.items}
            renderItem={(item, itemIndex) => (
              <List.Item style={{ padding: '12px 16px' }}>
                <Row style={{ width: '100%' }} gutter={[8, 8]} align="middle">
                  <Col xs={24} sm={8}>
                    <Text>{item.name}</Text>
                  </Col>
                  <Col xs={24} sm={6}>
                    <InputNumber
                      addonBefore="MMK"
                      value={item.price}
                      min={0}
                      style={{ width: '100%' }}
                      onChange={(value) =>
                        updateItem(groupIndex, itemIndex, 'price', value || 0)
                      }
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <InputNumber
                      addonBefore="Qty"
                      value={item.stock}
                      min={0}
                      style={{ width: '100%' }}
                      onChange={(value) =>
                        updateItem(groupIndex, itemIndex, 'stock', value || 0)
                      }
                    />
                  </Col>
                  <Col xs={24} sm={4}>
                    <Button
                      danger
                      type="link"
                      onClick={() => handleDelete(groupIndex, itemIndex)}
                      block
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </div>
      ))}
    </>
  );
};

export default VariantEditor;
