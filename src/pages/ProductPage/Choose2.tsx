import { ColumnsType } from 'antd/es/table'
import { Button, Drawer, Form, Input, Space, Table, Timeline, message } from 'antd'
import { faker } from '@faker-js/faker'

import React, { useEffect, useState } from 'react'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb'
import axios from 'axios'
import toast from 'react-hot-toast'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function ProductPage2() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const tokenAdmin = localStorage.getItem('token')
  const {id} = useParams()
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
  const [dataQuestion, setDataQuestion] = useState([])
    const [arrQuestion, setArrQuestion]=useState<any>([])
  const handelFetchApi = async () => {
    const { data } = await axios.get('http://localhost:8000/api/get-all/questions')
    setDataQuestion(data.questions)
  }
  useEffect(() => {
    handelFetchApi()
  }, [])
  console.log(arrQuestion,'arrQuestion')
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
        return (
          <Space size='middle'>
            <Button
              onClick={() => {
               arrQuestion.includes(data.key) ? alert("câu hỏi đã có trong danh sách") : setArrQuestion([...arrQuestion,data.key])
              }}

              className={arrQuestion.includes(data.key) ? "bg-danger text-white":'bg-primary text-white'}
              size='middle'
            >
             {arrQuestion.includes(data.key) ?"Đã chọn" :"Chọn"}
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


  console.log(dataIdQuestion, 'dataIdQuestion')
  return (
    <div>

      <Breadcrumb pageName='Câu hỏi' />
      <div>
        <Button
          onClick={async() => {
            //
            const data = {
              question_ids :arrQuestion
            }
            await axios.post(`http://localhost:8000/api/posts/${id}/add-question`, data)
            message.success("Question added")
            setTimeout(() => {
            window.location.reload()
            },300)
          }}
          className='bg-primary my-5 text-white font-bold'
        >
       Xác nhận

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
