import React, { useEffect, useState } from 'react';
import './style.css';

import TableAction from '../TableAction/TableAction';
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Grid,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd';

import NameConvert from '../../../services/NameConvert';
import { PaginationType } from '../../../types/PaginationType';
import { PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { BasicTable } from './BasicTable';
import { Get } from '../../../services/BasicHttpServices';
import Html5DectorModal from '../BarcodeDector/Html5Dector';
import { ToastContainer, toast } from 'react-toastify';

const { useBreakpoint } = Grid;

//ဒီနေရမှာ Ant Designက Table သုံးလဲရတယ် Depedencyနဲနိုင်သမျှနဲအောင် လုပ်သာအကောင်းဆုံးပဲ
//Fetch လုပ်တာလဲ ပြချင်တဲ့ Column ကို Display Dataထဲထည့်ပေးရုံပဲ
//Fetch ကထွက်လာတဲ့ Databindingကလဲ အဆင်ပြေအောင် Componentအပြင်ပဲထုတ်ထားတယ်

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableFunctionType = (api: string) => Promise<PaginationType>;
interface PropsType {
  displayData: string[];
  api: string;
  fetch: (url: string) => Promise<PaginationType>;
  actionComponent?: React.FC<{ id: string }>; // add this props for userTableAction
}

export const NewsaleTable: React.FC<PropsType> = ({
  displayData,
  api,
  fetch,
  actionComponent, // add this props for userTableAction
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const intialValue: PaginationType = {
    data: [],
    pageIndex: 0,
    pageSize: 0,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    sortColumn: '',
    sortOrder: '',
    filterColumn: '',
    filterQuery: '',
  };
  const [loading, setloading] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState(displayData[1]);
  const [sortDirection, setSortDirection] = useState('desc');

  const [filterColumn, setFilterColumn] = useState(displayData[0]);
  const [filterQuery, setFilterQuery] = useState('');

  const [searchValue, setSearchValue] = useState('');

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<PaginationType>(intialValue);

  const screens = useBreakpoint();
  const isSmOrBelow = !screens.lg;
  const [url, setUrl] = useState('');
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  //ဒီထဲကParameterက Dotnet Core ထဲကPagination Getနဲ့ညှိပေးထားတာ
  //တကယ်လို့ပြင်ချင်ရင် Parameter တွေပြင်သုံးပေါ့
  useEffect(() => {
    let temp = `${api}?pageIndex=${
      pageIndex < 0 ? 0 : pageIndex
    }&pageSize=${pageSize}`;

    if (sortColumn !== '') {
      temp = temp + `&sortColumn=${sortColumn}&sortOrder=${sortDirection}`;
    }
    if (filterQuery !== '' && filterColumn !== '') {
      temp = temp + `&filterColumn=${filterColumn}&filterQuery=${filterQuery}`;
    }
    setUrl(temp);
  }, [
    sortColumn,
    sortDirection,
    pageSize,
    pageIndex,
    filterColumn,
    filterQuery,
    api,
    fetch,
    url,
  ]);

  useEffect(() => {
    setloading(true);
    const call = async () => {
      try {
        setData(await fetch(url));
        setloading(false);
      } catch (ex) {
        setloading(false);
      }
    };
    call();
  }, [fetch, url]);

  const exportToExcel = () => {
    const table = document.getElementById('reportTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: 'SheetJS' });
    XLSX.writeFile(wb, 'Report.xlsx');
  };

  const actionForModal = (id: any) => {
    const { id: dataId } = id;
    const onClick = (e: any) => {
      e.preventDefault();
      // await toast.promise(axios.get('/api/users/42'), {
      //   pending: 'Loading user…',
      //   success: (res) => `Loaded user ${res.data.name}`,
      //   error: 'Couldn’t load user!',
      // });
      toast.success(`The object id is ${dataId}`);
    };
    return (
      <a onClick={onClick}>
        <Space>Add</Space>
      </a>
    );
  };

  const { Option } = Select;

  //For Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenForBarcode, setIsModalOpenForBarcode] = useState(false);
  const [isQuantityModalOpen, setisQuantityModalOpen] = useState(false);

  return (
    <>
      <Card style={{ paddingBottom: isSmOrBelow ? 15 : 0 }}>
        <Form>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={10}>
              <Form.Item
                label={
                  <>
                    <Typography.Text style={{ paddingRight: 4 }}>
                      Search Column
                    </Typography.Text>
                    <QuestionCircleOutlined />
                  </>
                }
                name="Column"
              >
                <Select
                  onChange={(e) => setFilterColumn(e)}
                  placeholder="Please select"
                >
                  {displayData.map((display: string) => {
                    if (display.toLocaleLowerCase() !== 'id') {
                      // Add this conditional check
                      return (
                        <Option key={display} value={display}>
                          {NameConvert(display)}
                        </Option>
                      );
                    }
                    return null; // Return null for elements you want to skip
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={10}>
              <Form.Item label="Search Value" name="value">
                <Input
                  //addonBefore={selectBefore}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4}>
              <Button
                type="primary"
                onClick={() => {
                  setPageIndex(0);
                  setFilterQuery(searchValue);
                }}
                style={{ width: '100%' }}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <br />

      <div className="container">
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingBottom: 16 }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            Table
          </Typography.Title>
          <div>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <PlusCircleOutlined />
                Add Products
              </Button>
              <Button
                style={{ margin: '50 px' }}
                type="primary"
                onClick={() => {
                  setIsModalOpenForBarcode(true);
                }}
              >
                <PlusCircleOutlined />
                Add Products With Barcode/QR
              </Button>
            </Space>
          </div>
        </Flex>

        <div className="table-container">
          <table id="reportTable">
            <thead>
              <tr>
                <th>No</th>
                {displayData.map((display: string, i) => {
                  if (display !== 'id') {
                    return (
                      <th key={i} onClick={() => handleSort(display)}>
                        {NameConvert(display)}
                        {sortColumn === display && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </th>
                    );
                  } else {
                    return null;
                  }
                })}
                <th className="action-column-header">Action</th>
              </tr>
            </thead>
            {!loading && data && (
              <tbody>
                {data.data?.map((row, index) => {
                  const dataCells = displayData.map((display: string, i) => {
                    if (display !== 'id' && display !== 'quantity') {
                      const cellValue = row[display];
                      return <td key={i}>{cellValue?.toString() ?? 'N/A'}</td>;
                    } else if (display === 'quantity') {
                      const cellValue = row[display];
                      return (
                        <Tooltip
                          placement="topLeft"
                          title="Click to fix quantity"
                        >
                          <td
                            key={i}
                            onClick={() => setisQuantityModalOpen(true)}
                          >
                            <Typography.Link
                              strong
                              style={{
                                cursor: 'pointer',
                              }}
                            >
                              {cellValue?.toString() ?? 'N/A'}
                            </Typography.Link>
                          </td>
                        </Tooltip>
                      );
                    } else {
                      return null;
                    }
                  });

                  return (
                    <tr key={row['id']}>
                      <td>
                        {index + 1 + (pageIndex < 0 ? 0 : pageIndex) * pageSize}
                      </td>
                      {dataCells}
                      <td className="action-column-cell">
                        {actionComponent ? (
                          React.createElement(actionComponent, {
                            id: row['id'],
                          })
                        ) : (
                          <TableAction id={row['id']} />
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={3}>
                    <Typography.Text
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                    >
                      {' '}
                      Total
                    </Typography.Text>
                  </td>
                  <td>10</td>
                  <td>100</td>
                  <td></td>
                </tr>
              </tbody>
            )}
            {loading && (
              <tbody>
                {Array.from({ length: Math.min(pageSize, 100) }).map(
                  (_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        <div className="skeleton skeleton-text">
                          <img
                            src={`/layout/images/table-skeleton.svg`}
                            alt="..."
                            height="12"
                            className="mr-2"
                          />
                        </div>
                      </td>
                      {displayData.map((display, colIndex) => {
                        if (display !== 'id') {
                          return (
                            <td key={colIndex}>
                              <div className="skeleton skeleton-text">
                                <img
                                  src={`/layout/images/table-skeleton.svg`}
                                  alt="..."
                                  height="12"
                                  className="mr-2"
                                />
                              </div>
                            </td>
                          );
                        } else {
                          return null;
                        }
                      })}
                      {displayData.includes('id') && (
                        <td>
                          <div className="skeleton skeleton-button">
                            <img
                              src={`/layout/images/table-skeleton.svg`}
                              alt="..."
                              height="12"
                              className="mr-2"
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            )}
          </table>
        </div>
        <div className="pagination">
          <Pagination
            showSizeChanger
            pageSizeOptions={[10, 20, 50, 100, 1000, 10000]}
            defaultPageSize={10}
            onShowSizeChange={(current) => setPageSize(current)}
            defaultCurrent={+pageIndex}
            current={+pageIndex + 1}
            total={data.totalCount}
            onChange={(page, pageSize) => {
              setPageIndex(page - 1);

              setPageSize(pageSize);
            }}
          />
        </div>
      </div>

      <Modal
        title="Add Product Modal"
        width={{
          xs: '100%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <BasicTable
          api={'Product'}
          displayData={[
            'id',
            'name',
            'barcode',
            'costPrice',
            'retailPrice',
            'wholesalePrice',
          ]}
          fetch={async (url) => {
            const response = await Get(url);
            return response;
          }}
          actionComponent={actionForModal}
        />
      </Modal>

      {/* <BarcodeScannerModal
        isModalOpenForBarcode={isModalOpenForBarcode}
        setIsModalOpenForBarcode={setIsModalOpenForBarcode}
      ></BarcodeScannerModal> */}
      <Html5DectorModal
        isOpen={isModalOpenForBarcode}
        setIsOpen={setIsModalOpenForBarcode}
      ></Html5DectorModal>

      <Modal
        width={{
          xs: '100%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        title="Fix Quantity"
        open={isQuantityModalOpen} // Change to a state variable like isFixQuantityModalOpen when integrating
        onOk={() => {
          setisQuantityModalOpen(false);
        }}
        onCancel={() => {
          // handle close modal logic here
          setisQuantityModalOpen(false);
        }}
      >
        <Form layout="vertical">
          <Form.Item
            label="New Quantity"
            name="quantity"
            rules={[
              { required: true, message: 'Please input the new quantity!' },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer />
    </>
  );
};
