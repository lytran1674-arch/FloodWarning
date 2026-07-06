
// import { PredictionCard } from '../components/predictionjobs/predictionCard'
import { PredictionJobTable } from '../components/predictionjobs/PredictionJobTable';
import { Title } from '../components/predictionjobs/Title';
import { usePredictionJobs } from '../hooks/usePredictionJobs'
export const PredictionJobs=()=>{



    return (
        <div className='lg:m-6'>
            
    {/* <PredictionCard data={predictjobs}/> */}
    <PredictionJobTable/>
    </div>
    )
}
