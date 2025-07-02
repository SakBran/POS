import React, { useState } from 'react';
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

const initialData: VariantGroup[] = [
  { title: 'Small', items: [{ name: 'Red', price: 1000, stock: 10 }] },
  { title: 'Large', items: [{ name: 'Blue', price: 1200, stock: 5 }] },
];

interface Props {
  variants: VariantGroup[];
  setVariants: React.Dispatch<React.SetStateAction<VariantGroup[]>>;
}
const VariantEditor = ({ variants, setVariants }: Props) => {
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

  const handleDelete = (groupIndex: number, itemIndex: number) => {
    const newData = [...variants];
    newData[groupIndex].items.splice(itemIndex, 1);
    setVariants(newData);
  };

  return (
    <>
      {variants.map((group, groupIndex) => (
        <div key={group.title} style={{ marginBottom: 24 }}>
          <Divider orientation="left">{group.title}</Divider>

          {/* Header row - only visible on larger screens */}
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
            <Col xs={0} sm={4}></Col>
          </Row>

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
