import { ColumnsType } from 'antd/es/table'
import { Button, Drawer, Form, Input, Space, Table, Timeline } from 'antd'
import { faker } from '@faker-js/faker'

import React, { useEffect, useState } from 'react'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb'
import axios from 'axios'
import toast from 'react-hot-toast'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function ProductPage() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const tokenAdmin = localStorage.getItem('token')
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const idPro = searchParams.get('id')
  const [dataIdQuestion, setDataIdQuestion] = useState<any>()
  useEffect(() => {
    const handelFetchProdId = async () => {
      const { data } = await axios.get('http://localhost:8000/api/questions/' + idPro, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      setDataIdQuestion(data.question)
    }
    if (idPro) {
      handelFetchProdId()
    }
  }, [idPro])
  idPro &&
    form.setFieldsValue({
      question: dataIdQuestion?.question,
      options: dataIdQuestion?.options,
      chooseA: dataIdQuestion?.choose[0].q,
      chooseB: dataIdQuestion?.choose[1].q,
      chooseC: dataIdQuestion?.choose[2].q,
      chooseD: dataIdQuestion?.choose[3].q,
      answer: dataIdQuestion?.answer,
      point: dataIdQuestion?.point
    })

  const [formData, setFormData] = useState<any>('')

  const showDrawer2 = () => {
    setOpen2(true)

  }
  const onClose2 = () => {
    setOpen2(false)
    navigate({
      search: createSearchParams({
        id: ''
      }).toString()
    })
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
    navigate({
      search: createSearchParams({
        id: ''
      }).toString()
    })
  }

  const [dataQuestion, setDataQuestion] = useState([])

  const handelFetchApi = async () => {
    const { data } = await axios.get('http://localhost:8000/api/get-all/questions')
    setDataQuestion(data.questions)
  }
  useEffect(() => {
    handelFetchApi()
  }, [])
  const handelRemoveQuestion = async (id: any) => {
    await axios.delete('http://localhost:8000/api/delete-questions/' + id, {
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
      key: 'options',
      dataIndex: 'options',
      title: 'Thể loại'
    },
    {
      key: 'point',
      dataIndex: 'point',
      title: 'Điểm'
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
                showDrawer2()
              }}
              type='primary'
              className='bg-blue-600'
              size='middle'
            >
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
          </Space>
        )
      }
    }
  ]

  const data: any[] = dataQuestion.map((items: any, index: number) => ({
    key: items.id,
    stt: index + 1,
    name: items.question,
    options: items.options,
    point: items.point,
    image : items.newImage
  }))
  const onFinish = async (values: any) => {
    const chooeseAnser = []
    chooeseAnser.push({ q: values.chooseA ,type:"A"})
    chooeseAnser.push({ q: values.chooseB ,type:"B"})
    chooeseAnser.push({ q: values.chooseC ,type:"C"})
    chooeseAnser.push({ q: values.chooseD ,type:"D"})

    const dataCreate = {
      question: values.question,
      options: values.options,
      choose: chooeseAnser,
      answer: values.answer,
      point: values.point,
      newImage : formData
    }
    
    if (!idPro) {
      await axios.post('http://localhost:8000/api/create-question', dataCreate, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      onClose2()
      onClose()
      handelFetchApi()
      console.log('Success:', chooeseAnser)

      setTimeout(() => {
        window.location.reload()
      }, 350);
    } else {
      await axios.put('http://localhost:8000/api/edit-questions/' + idPro, dataCreate, {
        headers: {
          Authorization: 'Bearer ' + tokenAdmin
        }
      })
      onClose2()
      onClose()
      handelFetchApi()
      setTimeout(() => {
        window.location.reload()
      }, 350);
    }
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  
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

  console.log(dataIdQuestion, 'dataIdQuestion')
  return (
    <div>
      <Drawer title={idPro ? 'Sửa câu hỏi' : 'Thêm câu hỏi'} onClose={onClose} open={open}>
        <Form
          form={form}
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
      <Drawer placement={'top'} height={1000} title='Chi tiết câu hỏi' onClose={onClose2} open={open2}>
        <Timeline
          items={[
            {
              children: 'Question ' + dataIdQuestion?.question
            },
              {
              children: (
        <>
          <span>Image</span>
          <img className='w-[100px]' src={dataIdQuestion?.newImage} alt="Question Image" />
        </>
      )
            },
            {
              children: 'Option ' + dataIdQuestion?.option
            },
            {
              children: 'Answer ' + dataIdQuestion?.answer
            },
            {
              children: 'Point ' + dataIdQuestion?.point
            }
          ]}
        />
        <div>
          {dataIdQuestion?.choose?.map((choice: any, index: number) => {
            const arr = ['A', 'B', 'C', 'D']
            return (
              <div className='flex gap-3' key={index}>
                <p className='text-black text-lg font-bold'>đáp án {arr[index]} :</p>
                <p>{choice.q}</p>
              </div>
            )
          })}
        </div>
      </Drawer>
      <Breadcrumb pageName='Câu hỏi' />
      <div>
        <Button
          onClick={() => {
            form.resetFields();
            navigate({
              search: createSearchParams({
                id: ''
              }).toString()
            })
            showDrawer()
          }}
          className='bg-primary my-5 text-white font-bold'
        >
          Tạo mới câu hỏi
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
// {
//   "id": 2,
//   "question": "question 3",
//   "image": "a.png",
//   "options": "multi",
//   "answer": "A",
//   "point": 1,
//   "choose": [
//       {
//           "q": "22"
//       },
//       {
//           "q": "22"
//       },
//       {
//           "q": "22"
//       },
//       {
//           "q": "22"
//       }
//   ],
//   "created_at": "2024-05-16T06:08:20.000000Z",
//   "updated_at": "2024-05-16T06:10:43.000000Z"
// }
