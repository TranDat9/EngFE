import { ColumnsType } from 'antd/es/table'
import { Button, Drawer, Form, Input, Space, Table, Timeline } from 'antd'
import { faker } from '@faker-js/faker'

import React, { useEffect, useState } from 'react'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb'
import axios from 'axios'
import toast from 'react-hot-toast'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

interface OrderDataType {
  key: React.Key
  orderBy: string
  orderStatus: string
  paymentMethod: string
  cost: number
  currency: string
}

const OrderPage = () => {
  const [open2, setOpen2] = useState(false)
  const [open, setOpen] = useState(false)

  const tokenAdmin = localStorage.getItem('token')
  const [dataQuestion, setDataQuestion] = useState([])
  const [searchParams] = useSearchParams()
  const idPro = searchParams.get('id')
  const [dataIdQuestion, setDataIdQuestion] = useState<any>()
  useEffect(() => {
    const handelFetchProdId = async () => {
      const { data } = await axios.get('http://localhost:8000/api/getIdHistory/' + idPro, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      console.log(data,'dataIdQuestion')
      setDataIdQuestion(data.historyExam)
    }
    if (idPro) {
      handelFetchProdId()
    }
  }, [idPro])
  const showDrawer2 = () => {
    setOpen2(true)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const onClose2 = () => {
    setOpen2(false)
  }
  const handelFetchApi = async () => {
    const { data } = await axios.get('http://localhost:8000/api/getAll-history')
    console.log(data)
    setDataQuestion(data.historyExams)
  }
  useEffect(() => {
    handelFetchApi()
  }, [])
  const handelRemoveQuestion = async (id: any) => {
    await axios.delete('http://localhost:8000/api/delete-History/'+ id, {
      headers: {
        Authorization: 'Bearer ' + tokenAdmin
      }
    })
    toast.success('Successfully deleted')
    handelFetchApi()
  }
  const navigate = useNavigate()
  const columns: any = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name'
    },
    {
      key: 'create',
      dataIndex: 'create',
      title: 'Ngày tạo',
      render: (p: any) => {
        return <p>{p?.split('T')[0]}</p>
      }
    },
    {
      key: 'update',
      dataIndex: 'update',
      title: 'Ngày sửa',
      render: (p: any) => {
        return <p>{p?.split('T')[0]}</p>
      }
    },
    {
      key: 'action',
      title: 'Action',

      render: (data: any) => {
        console.log(data, 'c')
        return (
          <Space size='middle'>
            <Button onClick={()=>{showDrawer2()
              navigate({
                search:createSearchParams({
                  id : data.key
                }).toString()
              })
            }} type='primary' className='bg-blue-600' size='middle'>
              Chi tiết
            </Button>

            <Button
              onClick={() => {
                navigate({
                  search:createSearchParams({
                    id : data.key
                  }).toString()
                })
                if (window.confirm('Are you sure you want to delete this')) {
                  handelRemoveQuestion(data.key)
                }
              }}
              danger
              type='primary'
            >
              Delete
            </Button>

          </Space>
        )
      }
    }
  ]
  const data: any[] = dataQuestion?.map((items: any, index: number) => {
    console.log(items, 'items')
    return {
      key: items.id,
      stt: index + 1,
      name: items.name_user,
      create: items.created_at,
      update: items.updated_at
    }
  })
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const onFinish = (values: any) => {
    console.log('values:', values)
  }

  return (
    <div>
    <Drawer title='Basic Drawer' onClose={onClose} open={open}>
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='question'
          name='question'
          rules={[{ required: true, message: 'Please input your question!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label='options' name='options' rules={[{ required: true, message: 'Please input your options!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='choose A'
          name='chooseA'
          rules={[{ required: true, message: 'Please input your options!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='choose B'
          name='chooseB'
          rules={[{ required: true, message: 'Please input your options!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='choose C'
          name='chooseC'
          rules={[{ required: true, message: 'Please input your options!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='choose D'
          name='chooseD'
          rules={[{ required: true, message: 'Please input your options!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='answer' name='answer' rules={[{ required: true, message: 'Please input your answer!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='point' name='point' rules={[{ required: true, message: 'Please input your point!' }]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
    <Drawer placement={'top'} height={1000} title='Basic Drawer' onClose={onClose2} open={open2}
     style={{ overflow: 'auto' }}
    >
    <Timeline
          items={[
            {
              children: 'Điểm số ' + dataIdQuestion?.score

            },
            // {
            //   children: 'số câu đúng ' + dataIdQuestion?.correct_answer
            // },
            // {
            //   children: 'số câu sai ' + dataIdQuestion?.fail_answer
            // },
            {
              children: 'ngày nộp bài ' + dataIdQuestion?.created_at?.split('T')[0]
            }
          ]}
        />
         {dataIdQuestion?.question_check?.map((choice: any, index: number) => {
            const arr = ['A', 'B', 'C', 'D']
            return (
              <div className=' gap-3 mt-3' key={index}>
                <p>Câu {index + 1} </p>
                <p>Nội dung : {choice.question} </p>
                 <p>
                  Ảnh : <img className='w-[80px]' src={choice.image} alt="" />
                </p>
                <p className='text-black text-lg font-bold'> đáp án  : {choice.answer}</p>
                <p> lựa chọn {choice.isCorrect ? "Đúng" :"sai"}</p>
                <p> Điểm {choice.point }</p>
                <p>Đáp án người dùng chọn {choice.user_choose}</p>
              </div>
            )
          })}
    </Drawer>
    <Breadcrumb pageName='category' />
    <Table columns={columns} dataSource={data} />
  </div>
  )
}

export default OrderPage
