import { RouterProvider } from 'react-router-dom'

import { ConfigProvider, theme } from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'
import './App.css'
import routers from './routes/routes'
import { useAppSelector } from './store/hooks'
const App = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.theme)

  return (
    <ConfigProvider
      locale={vi_VN}
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <RouterProvider router={routers} />
    </ConfigProvider>
  )
}

export default App
