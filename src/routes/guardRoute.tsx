import { RootState } from '~/store/store'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppSelector } from '~/store/hooks'
import { useEffect } from 'react'
interface Props {
  JSX: () => JSX.Element
}

export const GuardAccount = ({ JSX }: Props) => {
  const checkUser = localStorage.getItem('user')
  const isAdmin = JSON.parse(checkUser || '{}')
  const navigate = useNavigate()
    if(isAdmin.role && isAdmin.role =="admin"){
      return  <JSX />
    }else{
      alert("Bạn không có quyền truy cập vào trang này")
      localStorage.clear()
      navigate('/')
    }
}
