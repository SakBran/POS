import { PageHeader } from '../../components';
import { BasicTable } from '../../components/My Components/Table/BasicTable';
import UserTableAction from '../../components/My Components/TableAction/UserTableAction';
import { Get } from '../../services/BasicHttpServices';
import { PaginationType } from '../../types/PaginationType';

const ProductList: React.FC = () => {
  // Example transformation function for table data
  const transformData = (data: PaginationType): PaginationType => {
    return {
      ...data,
      data: data.data.map((item) => ({
        ...item,
        // Example: Transform a boolean 'isActive' string to 'Active'/'InActive'
        isActive:
          item.isActive === 'True'
            ? 'Active'
            : item.isActive === 'False'
              ? 'InActive'
              : 'N/A',
      })),
    };
  };

  return (
    <>
      <PageHeader title="Product list" />
      <BasicTable
        api={'Product'}
        displayData={[
          'id',
          'name',
          'barcode',
          'costPrice',
          'retailPrice',
          'wholesalePrice',
          'createdAt',
        ]}
        fetch={async (url) => {
          const response = await Get(url);
          return transformData(response);
        }}
        actionComponent={UserTableAction}
      />
    </>
  );
};

export default ProductList;
