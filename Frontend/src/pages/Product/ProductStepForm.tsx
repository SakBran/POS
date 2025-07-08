import React, { useEffect, useState } from 'react';
import { Steps, Typography } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useStepContext } from '../../components/My Components/StepForm/StepContext';
import ProductStep from './Steps/ProductStep';
import VariantsStep from './Steps/VariantsStep';
import UnitStep from './Steps/UnitStep';

const ProudctStepForm: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: 'General',
      content: (
        <ProductStep current={current} setCurrent={setCurrent}></ProductStep>
      ),
    },
    {
      title: 'Variants & Stocks',
      content: (
        <VariantsStep current={current} setCurrent={setCurrent}></VariantsStep>
      ),
    },
    {
      title: 'Units',
      content: <UnitStep current={current} setCurrent={setCurrent}></UnitStep>,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const stepContext = useStepContext();
  useEffect(() => {
    console.log(stepContext.applicationNo);
  }, [stepContext.applicationNo]);
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Typography.Text code>
          Application No : {stepContext.applicationNo}
        </Typography.Text>
      </div>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: isMobile ? '1rem' : '2rem',
          paddingBottom: 0,
        }}
      >
        <Steps current={current} items={items} responsive />
        {steps[current].content}
      </div>
    </>
  );
};

export default ProudctStepForm;
