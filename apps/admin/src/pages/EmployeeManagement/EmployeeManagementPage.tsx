import { Table, Avatar, Input, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { Employee, employees } from './employeesMockData';
import AddNewButton from '../../components/common/AddNewButton';
import { useNavigate } from 'react-router-dom';

const EmployeeManagementPage = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const filteredData = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.phone.includes(searchText),
  );

  const columns: ColumnsType<Employee> = [
    {
      title: 'Employee',
      key: 'name',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar src={record.avatar.url} />
          <div>{record.name}</div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      sorter: (a, b) =>
        a.joinDate.toDate().getTime() - b.joinDate.toDate().getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: Employee['status'], record) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => {
            console.log('Toggle:', record.id, checked);
          }}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <text className="text-xl font-semibold">Employee Management</text>
        <AddNewButton to="/employees/add-new" label="Add Employee" />
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder="Search by name or phone..."
          className="w-96"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        className="w-full"
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5, position: ['bottomCenter'] }}
        onRow={(record) => ({
          onClick: () => navigate(`/employees/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default EmployeeManagementPage;
