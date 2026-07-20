
import { WaterLevelOverview } from "../component/WaterLevelOverview";



export const SumWaterPage = () => {

 

  return (
    <div>
 

   

      <div className="flex flex-col lg:flex-row lg:gap-2 lg:justify-between lg:mr-2 m-2">
        <WaterLevelOverview
          // data={data}
          // loading={loading}
        />

       
      </div>
    </div>
  );
};