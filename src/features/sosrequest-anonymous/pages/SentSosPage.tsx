import { Header } from '../components/Header'
import { Menu } from '../components/Menu'
import SentRequestAnonymousPage from '../components/Sentrequestanonymouspage'

export const SentSosPage = () => {
  return (
    <div>
      <Header />
      <Menu />
      <main className="pt-[61px] sm:pt-[58px] lg:pt-[64px] lg:pl-[240px]">
        <div className="px-4">
          <SentRequestAnonymousPage />
        </div>
      </main>
    </div>
  )
}