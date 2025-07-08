import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Radio,
  Row,
  Space,
} from 'antd';
import BasicStepForm from '../../../components/My Components/StepForm/BasicStepForm';
import { useEffect, useState } from 'react';
import { CodeOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import VariantEditor, { Variant, VariantGroup } from './EditableList';
import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../services/AxiosInstance';
import { current } from '@reduxjs/toolkit';

type StepProps = {
  current: number;
  setCurrent: (current: number) => void;
};

interface variantInput {
  [key: string]: string;
}

interface VariantsStepDto {
  hasVariants: boolean;
  variantInputs: variantInput;
  variants: VariantGroup[];
}
const defaultData: VariantsStepDto = {
  hasVariants: false,
  variantInputs: {},
  variants: [],
};

const onLoadDataFetch = async (
  productId: string,
  setData: React.Dispatch<React.SetStateAction<VariantsStepDto>>
) => {
  const url = `Product/GetProductWithVariants/${productId}`;
  try {
    const resp = await axiosInstance.get(url);
    const productData: VariantsStepDto = await resp.data;
    setData(productData);
  } catch (ex) {
    console.log(ex);
  }
};

const handleAddRequest = async (
  productId: string,
  data: VariantsStepDto,
  setData: React.Dispatch<React.SetStateAction<VariantsStepDto>>,
  current: number,
  setCurrent: (current: number) => void
) => {
  const url = `Product/Variants/${productId}`;
  try {
    const resp = await axiosInstance.put(url, data);
    const productData: VariantsStepDto = await resp.data;
    setData(productData);
    setCurrent(current + 1); // move to next step after saving
  } catch (ex) {
    console.log(ex);
  }
};

const VariantsStep: React.FC<StepProps> = ({ current, setCurrent }) => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      onLoadDataFetch(id, setData);
      formRef.current?.setFieldValue('hasVariants', data.hasVariants);
    }
  }, [id]);

  const [options, setOptions] = useState(['Colour', 'Size']);
  const [selected, setSelected] = useState<string[]>([]);
  const formRef = React.useRef<FormInstance>(null);
  const [data, setData] = useState<VariantsStepDto>(defaultData);
  useEffect(() => {
    if (data.variantInputs) {
      const keys = Object.keys(data.variantInputs);
      setSelected(keys);
    }
  }, [data]);

  const setVariants = (value: VariantGroup[]) => {
    setData((prev) => ({ ...prev, variants: value }));
  };

  const [newOption, setNewOption] = useState('');

  const handleAdd = () => {
    if (newOption && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setSelected([...selected, newOption]); // auto‑select new option
      setNewOption('');
    }
  };

  const onInputChange = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      variantInputs: {
        ...prev.variantInputs,
        [key]: value,
      },
    }));
  };
  // 🔸 watch the HasVariants field
  //const [hasVariants, setHasvariants] = useState<boolean>(false);

  const generateCombinations = async (): Promise<void> => {
    const valueLists: string[][] = Object.entries(data.variantInputs)
      .filter(([key]) => selected.includes(key))
      .map(([, value]) =>
        value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      );

    const keys = selected; // e.g. ['Color', 'Size']

    if (valueLists.length === 0 || keys.length === 0) return;

    // 🧠 Ask user with Swal which key to group by
    const { value: groupBy } = await Swal.fire({
      title: 'Choose group title',
      input: 'select',
      inputOptions: keys.reduce(
        (options, key) => {
          options[key] = key;
          return options;
        },
        {} as Record<string, string>
      ),
      inputPlaceholder: 'Select a group',
      showCancelButton: true,
    });

    if (!groupBy) return; // cancelled

    const groupIndex = keys.indexOf(groupBy);

    const cartesian = (arr: string[][]): string[][] =>
      arr.reduce<string[][]>(
        (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
        [[]]
      );

    const combos = cartesian(valueLists); // [["Red", "Small"], ...]

    const groupsMap: Record<string, Variant[]> = {};

    combos.forEach((combo) => {
      const groupTitle = combo[groupIndex];
      const nameParts = combo.filter((_, i) => i !== groupIndex);
      const variantName = nameParts.join(' / ') || groupTitle;

      if (!groupsMap[groupTitle]) groupsMap[groupTitle] = [];

      groupsMap[groupTitle].push({
        name: variantName,
        price: 0,
        stock: 0,
      });
    });

    const result: VariantGroup[] = Object.entries(groupsMap).map(
      ([title, items]) => ({ title, items })
    );

    console.log('Generated VariantGroups:', result);
    ShowModal(result);
  };

  const ShowModal = (data: VariantGroup[]) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User confirmed!');
        setVariants(data);
      } else {
        console.log('User cancelled');
      }
    });
  };

  const onFinish = (values: unknown) => {
    if (id) {
      handleAddRequest(id, data, setData, current, setCurrent);
    }
  };

  return (
    <BasicStepForm
      onFinishCustomize={onFinish}
      current={current}
      setCurrent={setCurrent}
      formRefUserDefined={formRef}
      APIURL="Product"
    >
      <Form.Item label="Has Variants">
        <Radio.Group
          value={data.hasVariants}
          onChange={(e) =>
            setData((prev) => ({ ...prev, hasVariants: e.target.value }))
          }
          options={[
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
          ]}
        />
      </Form.Item>

      {/* 🔸 show this block only if Yes is selected */}
      {data.hasVariants && (
        <div>
          <Form.Item label="Variants">
            <Checkbox.Group
              value={selected}
              onChange={(vals) => setSelected(vals as string[])}
            >
              <Row gutter={[12, 12]}>
                {options.map((item) => (
                  <Col key={item} xs={24} sm={12} md={12} lg={12}>
                    <Checkbox value={item}>{item}</Checkbox>

                    {selected.includes(item) && (
                      <Form.Item>
                        <Input
                          placeholder={`Enter value for ${item}`}
                          value={data.variantInputs[item] || ''}
                          onChange={(e) => onInputChange(item, e.target.value)}
                          style={{ marginTop: 8 }}
                        />
                      </Form.Item>
                    )}
                  </Col>
                ))}

                <Col>
                  <Space>
                    <Input
                      placeholder="Add new variant"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onPressEnter={handleAdd}
                    />
                    <Button type="primary" onClick={handleAdd}>
                      Add
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="Generate Products Based on Variants">
            <Button onClick={generateCombinations}>
              <CodeOutlined />
              Generate
            </Button>
          </Form.Item>
          <Form.Item>
            <VariantEditor
              variants={data.variants}
              setVariants={setVariants}
            ></VariantEditor>
          </Form.Item>
        </div>
      )}
    </BasicStepForm>
  );
};

export default VariantsStep;
