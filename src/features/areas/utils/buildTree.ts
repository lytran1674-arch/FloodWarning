import type { Area, AreaTree } from "../types/areaType";

export const buildTree=(
    areas: Area[]
): AreaTree[] =>{
    const map = new Map<string,AreaTree>()

    const roots: AreaTree[]=[]

    //tạo map
    areas.forEach((area)=>{
        map.set(area.area_id,{
            ...area,
            children: [],
        })
    })

    // nối cha const
    areas.forEach((area)=>{
        const item=map.get(area.area_id)!

        if(area.parent_id){
            const parent=map.get(area.parent_id)

            parent?.children?.push(item)
        }else{
            roots.push(item)
        }
    })
    return roots
}