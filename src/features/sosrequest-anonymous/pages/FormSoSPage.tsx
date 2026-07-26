import { Header } from '../components/Header'
import { Menu } from '../components/Menu'
import { SOSRequestAnonymous } from '../components/SoSAnonymous'

export const FormSoSPage = () => {
  return (
    <div>
      <Header />
      <Menu />
      <main className="pt-[61px] sm:pt-[58px] lg:pt-[64px] lg:pl-[240px]">
        <div className="px-4">
          <SOSRequestAnonymous />
        </div>
      </main>
    </div>
  )
}