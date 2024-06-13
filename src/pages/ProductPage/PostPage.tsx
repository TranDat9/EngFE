import { ColumnsType } from 'antd/es/table'
import { Button, Drawer, Form, Input, Select, Space, Table, Timeline } from 'antd'
import { faker } from '@faker-js/faker'

import React, { useEffect, useState } from 'react'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb'
import axios from 'axios'
import toast from 'react-hot-toast'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
const PostPage = () => {
  const [open2, setOpen2] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()

  const idPro = searchParams.get('id')
  // const idPro = searchParams.get('id')

  const navigate = useNavigate()
  const tokenAdmin = localStorage.getItem('token')
  const [dataQuestion, setDataQuestion] = useState([])
  const [dataTopic, setDataTopic] = useState([])
  const [dataPost, setPost] = useState<any>()
  const [questionPo,setQuestionPo] = useState([])
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
    const handelFetchApiID = async () => {
      const { data } = await axios.get('http://localhost:8000/api/posts/' + idPro)
      setPost(data.post)
      setQuestionPo(data?.questions)
    }
  useEffect(() => {
    idPro && handelFetchApiID()
  }, [idPro])
  const handelFetchApiTopic = async () => {
    const { data } = await axios.get('http://localhost:8000/api/topics')
    console.log(data)
    setDataTopic(data.topics)
  }
  idPro &&
    form.setFieldsValue({
      question: dataPost?.name,
      topic: dataPost?.topic.id
    })
  useEffect(() => {
    handelFetchApiTopic()
  }, [])
  const handelFetchApi = async () => {
    const { data } = await axios.get('http://localhost:8000/api/posts')
    console.log(data)
    setDataQuestion(data.posts)
  }
  useEffect(() => {
    handelFetchApi()
  }, [])
  const handelRemoveQuestion = async (id: any) => {
    await axios.delete('http://localhost:8000/api/posts/' + id, {
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
            <Button onClick={() => {
              handelFetchApiID()
              showDrawer2()
              navigate({
                search: createSearchParams({
                  id : data.key
                }).toString()
              })
            }} type='primary' className='bg-blue-600' size='middle'>
              Chi tiết
            </Button>
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
            <Button
              onClick={() => {
                navigate('/manager/chooseOk/'+data.key)
              }}
              type='primary'
            >
              Thêm câu hỏi
            </Button>
          </Space>
        )
      }
    }
  ]
  console.log(dataPost,'dataPost')
  const data: any[] = dataQuestion.map((items: any, index: number) => {
    console.log(items, 'items')
    return {
      key: items.id,
      stt: index + 1,
      name: items.name,
      create: items.created_at,
      update: items.updated_at
    }
  })
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const onFinish = async (values: any) => {
    console.log('Finished:', values.topic)

    if (!idPro) {
      const dataCreate = {
        name: values.question,
        topic_id: values?.topic[0]
      }
      console.log('Invalid')
      await axios.post('http://localhost:8000/api/posts', dataCreate, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      onClose2()
      onClose()
      handelFetchApi()
    } else {
      const dataCreateEdit = {
        name: values.question,
        topic_id: dataPost?.topic.id
      }
      await axios.put('http://localhost:8000/api/posts/' + idPro, dataCreateEdit, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      onClose2()
      onClose()
      handelFetchApi()
    }
  }
  return (
    <div>
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
              label='Tên nội dung'
              name='question'
              rules={[{ required: true, message: 'Please input your question!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            {!idPro && (
              <Form.Item name='topic' label='Chủ đề' rules={[{ required: true, message: 'Chủ đề là bắt buộc' }]}>
                <Select size='large' mode='multiple' allowClear placeholder='Lựa chọn Chủ đề'>
                  {dataTopic.map((topping: any) => (
                    <Select.Option value={topping.id} key={topping.id}>
                      <span className='capitalize'>{topping.name}</span>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
        <Drawer placement={'top'} height={1000} title='Basic Drawer' onClose={onClose2} open={open2}>
           <Timeline
          items={[
            {
              children: 'Tên  ' + dataPost?.name
            },
            // questionPo
            {
              children: 'Option ' + dataPost?.option
            },
            {
              children: 'Answer ' + dataPost?.answer
            },
            {
              children: 'Point ' + dataPost?.point
            }
          ]}
          />
               {questionPo?.map((choice: any, index: number) => {
            const arr = ['A', 'B', 'C', 'D']
            return (
              <div className=' gap-3 mt-3' key={index}>
                <p>Câu {index + 1} </p>
                <p>Nội dung : {choice.question} </p>
                <p>
                  Ảnh : <img className='w-[80px]' src={choice.newImage} alt="" />
                </p>
                <p className='text-black text-lg font-bold'> đáp án  : {choice.answer}</p>
                <p> Điểm {choice.point}</p>
                <p>Đáp án A : {choice.choose[0].q}</p>
                <p>Đáp án B : {choice.choose[1].q}</p>
                <p>Đáp án C : {choice.choose[2].q}</p>
                <p>Đáp án D : {choice.choose[3].q}</p>

              </div>
            )
          })}
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
            Tạo nội dung mới
          </Button>
        </div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default PostPage
