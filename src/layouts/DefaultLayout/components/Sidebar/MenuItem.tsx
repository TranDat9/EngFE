import { BarChartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { AiOutlineControl } from 'react-icons/ai'
import { BiCategoryAlt, BiSolidCategoryAlt } from 'react-icons/bi'
import { FaClipboardList, FaListUl, FaPeopleArrows, FaRegNewspaper, FaUserEdit, FaUserFriends } from 'react-icons/fa'

import type { MenuProps } from 'antd'
import { NavLink } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

export const items: MenuProps['items'] = [
  // giao diên chính
  getItem(<NavLink to={`/dashboard`}>Thống kê</NavLink>, 'dashboard', <BarChartOutlined />),

  // quản lý đơn hàng
  getItem(<NavLink to={`/manager/orders`}>Đơn hàng</NavLink>, 'orders', <FaClipboardList />),

  // quản lý sản phẩm
  getItem('Quản lý', 'manager', <AiOutlineControl />, [
    getItem(<NavLink to={`/manager/products`}>Bộ câu hỏi</NavLink>, 'products', <ShoppingOutlined />),
    getItem(<NavLink to={`/manager/categories`}>Chủ đề</NavLink>, 'categories', <BiSolidCategoryAlt />),
    getItem(<NavLink to={`/manager/appointments`}>Nội dung bài học</NavLink>, 'Appointments', <FaListUl />),
  ]),
 // quản lý người dùng
 getItem('Người dùng', 'users', <UserOutlined />, [
  getItem(<NavLink to={`/manager/customers`}>Người dùng</NavLink>, 'customers', <FaUserFriends />),
  getItem(<NavLink to={`/manager/staffs`}>Quản trị</NavLink>, 'staffs', <FaUserEdit />)
])
]

export const itemsStaff: MenuProps['items'] = [
  // quản lý đơn hàng
 getItem(<NavLink to={`/manager/orders`}>Danh sách bài làm</NavLink>, 'orders', <FaClipboardList />),

  // quản lý sản phẩm
   getItem('Quản lý', 'manager', <AiOutlineControl />, [
    getItem(<NavLink to={`/manager/products`}>Bộ câu hỏi</NavLink>, 'products', <ShoppingOutlined />),
    getItem(<NavLink to={`/manager/categories`}>Chủ đề</NavLink>, 'categories', <BiSolidCategoryAlt />),
    getItem(<NavLink to={`/manager/appointments`}>Nội dung bài học</NavLink>, 'Appointments', <FaListUl />),
  ]),

  // quản lý người dùng
  getItem('Người dùng', 'users', <UserOutlined />, [
    getItem(<NavLink to={`/manager/customers`}>Người dùng</NavLink>, 'customers', <FaUserFriends />),
    getItem(<NavLink to={`/manager/staffs`}>Quản trị</NavLink>, 'staffs', <FaUserEdit />)
  ])
]
