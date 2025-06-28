import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetGUID from '../../services/GUIDService';

const GenerateGUIDPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/Newsale/Edit/${GetGUID()}`);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return <Spin spinning={true}>Loading Please wait</Spin>;
};

export default GenerateGUIDPage;
