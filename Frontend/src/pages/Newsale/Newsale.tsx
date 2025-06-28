import { PageHeader } from '../../components';
import { Get } from '../../services/BasicHttpServices';
import { PaginationType } from '../../types/PaginationType';
import { NewsaleTable } from '../../components/My Components/Table/NewsaleTable';

const Newsale = () => {
  const route = location.pathname.toString().split('/');
  const id = route[3] ?? toString();
  const transformUserData = (data: PaginationType): PaginationType => {
    return {
      ...data,
      data: data.data.map((item) => ({
        ...item,
        isActive:
          item.isActive == 'True'
            ? 'Active'
            : item.isActive == 'False'
              ? 'InActive'
              : 'N/A',
      })),
    };
  };

  return (
    <>
      <PageHeader title="New Sale" />

      <NewsaleTable
        api={`Retail/GetByCartId?saleId=${id}`}
        displayData={['name', 'unitPrice', 'quantity', 'Amount', 'id']}
        fetch={async (url) => {
          const response = await Get(url);
          return transformUserData(response);
        }}
        // actionComponent={UserTableAction}
      />
    </>
  );
};

export default Newsale;
