import React, { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Button, Space, Table, Tag } from 'antd'
import { faker } from '@faker-js/faker'

import { DeleteOutlined } from '@ant-design/icons'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb'
import axios from 'axios'

interface CustomerDataType {
  key: React.Key
  firstName: string
  lastName: string
  email: string
  mobile: string
  role: string
  isActive: boolean
  address: string
}

const CustomerPage = () => {
  const [dataUser, setDataUser] = useState([])

  const [open, setOpen] = useState(false)

  const handelFetchApi = async () => {
    const { data } = await axios.get('http://localhost:8000/api/get-all-user')
    console.log(data)
    setDataUser(data)
  }
  useEffect(() => {
    handelFetchApi()
  }, [])

  const showDrawer = () => {
    setOpen(true)
  }
  const columns: ColumnsType<CustomerDataType> = [
    {
      key: 'stt',
      dataIndex: 'stt',
      title: '#'
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Họ tên'
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email'
    },

    {
      key: 'create',
      dataIndex: 'create',
      title: 'Ngày tạo',
      render: (x: any) => <Tag color='blue'>{x.split('T')[0]}</Tag>
    },
    {
      key: 'action',
      title: 'Action',
      render: ({ key }) => (
        <Space size='middle'>
          
          <Button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete')) {
                //
                axios.post('http://localhost:8000/api/remove-user/' + key).then(() => {
                  console.log('User deleted')
                  handelFetchApi()
                })
              }
            }}
            danger
            type='primary'
            className='flex items-center justify-center'
          >
            <DeleteOutlined />
          </Button>
        </Space>
      )
    }
  ]

  const data: any[] = dataUser
    .filter((i: any) => i.role != 'admin')
    .map((items: any, index: number) => {
      console.log(items, 'items')
      return {
        key: items.id,
        stt: index + 1,
        name: items.name,
        email: items.email,
        create: items.created_at,
        update: items.updated_at
      }
    })
    

  return (
    <div>
      <Breadcrumb pageName='custom' />
      <Table columns={columns} dataSource={data} />
    </div>
      
  )

  
}

export default CustomerPage
