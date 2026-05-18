export type AreaLevel= 1 | 2 | 3 | 4 
export interface Area{
    area_id: string
    tenkhuvuc: string
    mota: string
    parent_id: string | null
    level: AreaLevel
    lat?: number
    lon?: number

}

export interface AreaTree extends Area {
    children?: AreaTree[]
}
export interface CreateAreaPayLoad{
    tenkhuvuc: string
    mota?: string
    parent_id: string | null
    level: AreaLevel
    lat: number
    lon: number
}

export interface UpdateAreaPayLoad
    extends CreateAreaPayLoad{
    area_id: string
}

export interface AreaFilter{
    keyword?: string
    level?: AreaLevel | "all"
}