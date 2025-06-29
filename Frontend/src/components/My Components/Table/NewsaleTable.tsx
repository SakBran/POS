import React, { useEffect, useRef, useState } from 'react';
import './style.css';

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
import {
  DollarOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
// import * as XLSX from 'xlsx';
import { BasicTable } from './BasicTable';
import { Get } from '../../../services/BasicHttpServices';
import Html5DectorModal from '../BarcodeDector/Html5Dector';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../../../services/AxiosInstance';
import PaymentModal from './PaymentModal';
import PrintSection from './PrintSection';

const { useBreakpoint } = Grid;
export type TableFunctionType = (api: string) => Promise<PaginationType>;
interface PropsType {
  displayData: string[];
  api: string;
  fetch: (url: string) => Promise<PaginationType>;
  actionComponent?: React.FC<{ id: string }>; // add this props for userTableAction
}

export interface AddRequest {
  productId: string;
  salesId: string;
}

export interface EditQuantityRequest {
  productId: string;
  salesId: string;
  quantity: number;
}

interface TotalValue {
  quantity: number;
  amount: number;
}

export interface Sale {
  id: string;
  customerId: string | null;
  customerName: string;
  saleDate: string; // ISO date string
  voucherNumber: string;
  saleType: 'Retail' | 'Wholesale' | string;
  subtotal: number;
  discountType: 'Fixed' | 'Percentage' | string;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  amountPaid: number;
  balance: number;
  paymentMethod: 'cash' | 'card' | 'credit' | string;
  isPaidInFull: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string | null;
  storeId: string | null;
  storeName: string | null;
  rootUserId: string;
}

const initialSale: Sale = {
  id: '',
  customerId: null,
  customerName: 'Walk in customer',
  saleDate: new Date().toISOString().split('T')[0], // e.g., "2025-06-29"
  voucherNumber: '',
  saleType: 'Retail',
  subtotal: 0,
  discountType: 'Fixed',
  discount: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0,
  amountPaid: 0,
  balance: 0,
  paymentMethod: 'cash',
  isPaidInFull: false,
  createdAt: new Date().toISOString(),
  updatedAt: null,
  storeId: null,
  storeName: null,
  rootUserId: '',
};

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

  //For Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenForBarcode, setIsModalOpenForBarcode] = useState(false);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [reload, setReload] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [quantityId, setQuantityId] = useState<string>('');
  const screens = useBreakpoint();
  const isSmOrBelow = !screens.lg;
  const [url, setUrl] = useState('');
  const [total, setTotal] = useState<TotalValue>({ quantity: 0, amount: 0 });
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [sale, setSale] = useState<Sale>(initialSale);

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const route = location.pathname.toString().split('/');
  const salesId = route[3] ?? toString();
  const actionForModal = (id: any) => {
    const { id: dataId } = id;
    const onClick = (e: any) => {
      e.preventDefault();
      const SaveTask = async () => {
        const postdata: AddRequest = {
          productId: dataId,
          salesId: salesId,
        };
        await toast.promise(
          axiosInstance.post<AddRequest>('Retail/AddByTable', postdata),
          {
            pending: 'Loading user…',
            success: 'Loaded user successfully',
            error: 'Couldn’t load user!',
          }
        );
      };
      SaveTask();
    };
    return (
      <a onClick={onClick}>
        <Space>Add</Space>
      </a>
    );
  };

  const actionForDelete = (deleteId: any) => {
    const { id } = deleteId;
    const onClick = (e: any) => {
      e.preventDefault();
      const handleDelete = async (id: string) => {
        try {
          await toast.promise(axiosInstance.delete(`Retail/${id}`), {
            pending: 'Deleting...',
            success: {
              render() {
                // You can also update state here
                return 'Deleted successfully';
              },
            },
            error: {
              render() {
                return 'Failed to delete!';
              },
            },
          });

          // After success, update your state
          const filteredData = data.data.filter((item) => item.id !== id);
          console.log(filteredData);
          setData({
            ...data,
            data: filteredData,
            totalCount: data.totalCount - 1,
          });

          // setData(filteredData) // if you want to update UI
        } catch (err) {
          // Error is already handled in toast
        }
      };
      handleDelete(id);
    };
    return (
      <a onClick={onClick}>
        <Space>Delete</Space>
      </a>
    );
  };

  const actionForEditQuantity = (QuantityId: any) => {
    const Task = async (id: string) => {
      try {
        const postdata: EditQuantityRequest = {
          productId: quantityId,
          salesId: salesId,
          quantity: quantity,
        };
        await toast.promise(axiosInstance.put(`Retail/FixQuantity`, postdata), {
          pending: 'Updating...',
          success: {
            render() {
              // You can also update state here
              return 'Updated successfully';
            },
          },
          error: {
            render() {
              return 'Failed to update!';
            },
          },
        });

        // After success, update your state
        const filteredData = data.data.map((item) =>
          item.id === id ? { ...item, quantity: quantity } : item
        );

        console.log(filteredData);
        setData({
          ...data,
          data: filteredData,
        });
        setIsQuantityModalOpen(false);
      } catch (err) {
        console.log(err);
        // Error is already handled in toast
      }
    };
    Task(QuantityId);
  };

  const handlePrint = async () => {
    if (!printRef.current) {
      return;
    }
    const printContent = printRef.current.innerHTML;

    // Load HTML template from public folder
    const res = await window.fetch('/print-template.html');
    const template = await res.text();

    // Replace placeholder with actual invoice
    const htmlContent = template.replace('{{PRINT_CONTENT}}', printContent);

    const printWindow = window.open('', '', 'width=300,height=600');
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
  };

  const TaskToCheckPaid = React.useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        'RetailSales/GetByVoucherNo?id=' + salesId
      );
      const temp = response.data;
      if (temp) {
        const sale: Sale = JSON.parse(JSON.stringify(temp));
        setSale(sale);
        setIsPaid(true);
      } else {
        setIsPaid(false);
      }
    } catch (ex) {
      setIsPaid(false);
      //console.log(ex);
    }
  }, []);

  //ဒီထဲကParameterက Dotnet Core ထဲကPagination Getနဲ့ညှိပေးထားတာ
  //တကယ်လို့ပြင်ချင်ရင် Parameter တွေပြင်သုံးပေါ့
  useEffect(() => {
    let temp = `${api}&pageIndex=${
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
    if (isModalOpen === true) {
      return;
    }
    setloading(true);
    const call = async () => {
      try {
        setData(await fetch(url));
        await TaskToCheckPaid();
        setloading(false);
      } catch (ex) {
        setloading(false);
      }
    };
    call();
  }, [fetch, url, isModalOpen, reload]);

  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      const totalQuantity = data.data.reduce(
        (sum, item) => sum + (+item.quantity || 0),
        0
      );
      const totalAmount = data.data.reduce((sum, item) => {
        const unitPrice = +item.unitPrice || 0;
        const quantity = +item.quantity || 0;
        return sum + unitPrice * quantity;
      }, 0);
      setTotal({ quantity: totalQuantity, amount: totalAmount });
    } else {
      setTotal({ quantity: 0, amount: 0 });
    }
  }, [data]);

  // const exportToExcel = () => {
  //   const table = document.getElementById('reportTable');
  //   const wb = XLSX.utils.table_to_book(table, { sheet: 'SheetJS' });
  //   XLSX.writeFile(wb, 'Report.xlsx');
  // };

  const { Option } = Select;

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
          {isSmOrBelow === false && (
            <Typography.Title level={5} style={{ margin: 0 }}>
              Table
            </Typography.Title>
          )}

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
                    if (
                      display !== 'id' &&
                      display !== 'quantity' &&
                      display !== 'total'
                    ) {
                      const cellValue = row[display];
                      return <td key={i}>{cellValue?.toString() ?? 'N/A'}</td>;
                    } else if (display === 'quantity') {
                      const cellValue = row[display];
                      return (
                        <Tooltip
                          key={i}
                          placement="topLeft"
                          title="Click to fix quantity"
                        >
                          <td
                            key={i}
                            onClick={() => {
                              setQuantityId(row['id']);
                              setQuantity(+cellValue?.toString());
                              setIsQuantityModalOpen(true);
                            }}
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
                    } else if (display === 'total') {
                      const unitPrice = +row['unitPrice'];
                      const quantity = +row['quantity'];
                      return <td key={i}>{unitPrice * quantity}</td>;
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
                        {actionComponent
                          ? React.createElement(actionComponent, {
                              id: row['id'],
                            })
                          : React.createElement(actionForDelete, {
                              id: row['id'],
                            })}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td></td>
                  <td>ပစ္စည်းအမျိုးအရေတွက် - ({data.data.length}) မျိုး</td>
                  <td>စုစုပေါင်း</td>
                  <td>{total.quantity}</td>
                  <td>{total.amount}</td>
                  <td>
                    {!isPaid && (
                      <Button
                        type="primary"
                        onClick={() => {
                          setIsPaymentModalOpen(true);
                        }}
                      >
                        <DollarOutlined />
                        ရှင်းမည်။
                      </Button>
                    )}

                    {isPaid && (
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            setIsPaymentModalOpen(true);
                          }}
                        >
                          <DollarOutlined />
                          အချက်လက်ပြန်ပြင်မည်။
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => {
                            handlePrint();
                          }}
                        >
                          <PrinterOutlined />
                          ပြေစာထုတ်မည်။
                        </Button>
                      </Space>
                    )}
                  </td>
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
          displayData={
            isSmOrBelow
              ? ['id', 'name', 'retailPrice']
              : [
                  'id',
                  'name',
                  'barcode',
                  'costPrice',
                  'retailPrice',
                  'wholesalePrice',
                ]
          }
          fetch={async (url) => {
            const response = await Get(url);
            return response;
          }}
          actionComponent={actionForModal}
        />
      </Modal>

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
        title="..."
        open={isQuantityModalOpen} // Change to a state variable like isFixQuantityModalOpen when integrating
        onOk={() => {
          actionForEditQuantity(quantityId);
        }}
        onCancel={() => {
          // handle close modal logic here
          setIsQuantityModalOpen(false);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Space>
            Enter Quantity:
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(+e.target.value)}
              min={0}
            />
          </Space>
        </div>
      </Modal>

      <PaymentModal
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        setIsPaid={setIsPaid}
        isPaid={isPaid}
        subTotal={total.amount}
        setSale={setSale}
      ></PaymentModal>

      {/* Hidden or styled section for print */}
      <PrintSection
        printRef={printRef}
        dataList={data.data}
        invoiceNo={salesId}
        invoiceDate={new Date().toLocaleDateString('en-GB')}
        total={sale.total}
        subTotal={sale.subtotal}
        deliveryFee={sale.deliveryFee}
        discount={sale.discount}
        tax={sale.tax}
      ></PrintSection>

      <ToastContainer />
    </>
  );
};
