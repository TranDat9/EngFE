import { ColumnsType } from 'antd/es/table'
import { Button, Drawer, Form, Input, Space, Table } from 'antd'
import { faker } from '@faker-js/faker'

import React, { useEffect, useState } from 'react'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb'
import axios from 'axios'
import toast from 'react-hot-toast'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

interface CategoryDataType {
  key: React.Key
  name: string
  createdAt: string
  updatedAt: string
}

const CategoryPage = () => {
  const [open2, setOpen2] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const idPro = searchParams.get('id')
  const navigate = useNavigate()

  const [formData, setFormData] = useState<any>('')
  const [dataTopic, setDataTopic] = useState<any>()

  useEffect(() => {
    const handelFetchid = async () => {
      const { data } = await axios.get('http://localhost:8000/api/topics/' + idPro)
      setDataTopic(data.topic)
    }
    idPro && handelFetchid()
  }, [idPro])
  
  const tokenAdmin = localStorage.getItem('token')
  const [dataQuestion, setDataQuestion] = useState([])

  const showDrawer2 = () => {
    setOpen2(true)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    navigate({
      search: createSearchParams({
        id: ''
      }).toString()
    })
    setOpen(false)
  }
  const onClose2 = () => {
    setOpen2(false)
  }
  idPro &&
    form.setFieldsValue({
      question: dataTopic?.name
    })
  const handelFetchApi = async () => {
    const { data } = await axios.get('http://localhost:8000/api/topics')
    console.log(data)
    setDataQuestion(data.topics)
  }
  useEffect(() => {
    handelFetchApi()
  }, [])

  const handelRemoveQuestion = async (id: any) => {
    await axios.delete('http://localhost:8000/api/topics/' + id, {
      headers: {
        Authorization: 'Bearer ' + tokenAdmin
      }
    })
    toast.success('Successfully deleted')
    handelFetchApi()
  }
  const columns: any = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name'
    },
    {
      key: 'newImage',

      title: 'Ảnh',
      render: (image : any) => {
        console.log(image,'cc')
        return <img src={image.image} className='w-[80px]'/>
      }
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
            <Button
              onClick={() => {
                navigate({
                  search: createSearchParams({
                    id: data.key
                  }).toString()
                })
                showDrawer()
              }}
              type='primary'
              className='bg-blue-600'
              size='middle'
            >
              Edit
            </Button>
            <Button
              onClick={() => {
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
  const data: any[] = dataQuestion.map((items: any, index: number) => {
    console.log(items, 'items')
    return {
      key: items.id,
      stt: index + 1,
      name: items.name,
      image : items.newImage,
      create: items.created_at,
      update: items.updated_at
    }
  })
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const onFinish = async (values: any) => {
    const dataCreate = {
      name: values.question,
      newImage : formData
    }
    if (!idPro) {
      await axios.post('http://localhost:8000/api/topics', dataCreate, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      onClose2()
      onClose()
      handelFetchApi()
    } else {
      await axios.put('http://localhost:8000/api/topics/' + idPro, dataCreate, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      onClose2()
      onClose()
      handelFetchApi()
    }
  }



  //  read file image
  const handelChangefile = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <Drawer title='Basic Drawer' onClose={onClose} open={open}>
        <Form
          name='basic'
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
         >
          <Form.Item
            label='name topic'
            name='question'
            rules={[{ required: true, message: 'Please input your topic!' }]}
          >
            <Input.TextArea />
          </Form.Item>
                
             
          <Form.Item label='ảnh' name='image' >
            <Input type='file' onChange={handelChangefile} />
          </Form.Item>
               

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Drawer placement={'top'} height={1000} title='Basic Drawer' onClose={onClose2} open={open2}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Breadcrumb pageName='category' />
      <div>
        <Button
          onClick={() => {
            form.resetFields()
            navigate({
              search: createSearchParams({
                id: ''
              }).toString()
            })
            showDrawer()
          }}
          className='bg-primary my-5 text-white font-bold'
         >
          Tạo chủ đề mới
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default CategoryPage
