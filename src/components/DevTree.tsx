///components/devtree
import { Link, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import Header from './Header'
import { User } from '../types'

type DevTreeProps = {
  data: User
}

export default function DevTree({ data }: DevTreeProps) {
  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen py-10">
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={`/${data.username}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visitar Mi Perfil: /{data.username}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-4xl text-center text-white">{data.username}</p>            
              <p className="text-center text-lg font-black text-white">
                {data.nombre}
              </p>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  )
}
