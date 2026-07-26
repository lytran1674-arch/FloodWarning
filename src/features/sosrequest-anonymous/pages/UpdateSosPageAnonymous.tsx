import { Header } from '../components/Header'
import { Menu } from '../components/Menu'

import { UpdateSOSAnonymous } from '../components/UpdateAnonymous'

export const UpdateSosPageAnonymous = () => {
  return (
    <div>
      <Header />
      <Menu />
      <main className="pt-[61px] sm:pt-[58px] lg:pt-[64px] lg:pl-[240px]">
        <div className="px-4">
          <UpdateSOSAnonymous />
        </div>
      </main>
    </div>
  )
}