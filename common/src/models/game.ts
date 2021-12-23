import T, { ModelType } from "tsplate";


export const TBuildingType = T.Enum('MINE', 'LUMBERYARD', 'WAREHOUSE');
export type BuildingType = ModelType<typeof TBuildingType>;

export const TBuilding = T.Object({
    buildingId: T.Int,
    nodeId: T.Int,
    type: TBuildingType,
    inventory: T.Record(T.Int, T.Int), // itemId -> count
})
export type Building = ModelType<typeof TBuilding>;


export const TItemType = T.Enum('ORE', 'WOOD');
export type ItemType = ModelType<typeof TItemType>;

export const TItem = T.Object({
    itemId: T.Int,
    type: TItemType
})
export type Item = ModelType<typeof TItem>;


export const TVertex = T.Object({
    vertexId: T.Int,
    x: T.Float,
    y: T.Float
});
export type Vertex = ModelType<typeof TVertex>;


export const TZoneType = T.Enum('RESOURCE', 'COUNTRY');
export type ZoneType = ModelType<typeof TZoneType>;

export const TZone = T.Object({
    zoneId: T.Int,
    type: TZoneType,
    vertexIds: T.Array(T.Int)
});
export type Zone = ModelType<typeof TZone>;


export const TOwnerType = T.Enum('PERSON', 'CORPORATION', 'COMPANY', 'COUNTRY');
export type OwnerType = ModelType<typeof TOwnerType>;

export const TOwner = T.Object({
    ownerId: T.Int,
    ownerType: TOwnerType
});
export type Owner = ModelType<typeof TOwner>;


export const TStake = T.Object({
    stakeId: T.Int,
    corporationId: T.Int,
    personId: T.Int,
    stakes: T.Float
});
export type Stake = ModelType<typeof TStake>;


export const TCompany = T.Object({
    companyId: T.Int,
    name: T.String,
    buildingIds: T.Array(T.Int),
    money: T.Float,
    owner: TOwner
})
export type Company = ModelType<typeof TCompany>;


export const TCorporation = T.Object({
    corporationId: T.Int,
    name: T.String,
    companyIds: T.Array(T.Int),
    buildingIds: T.Array(T.Int),
    stakeIds: T.Array(T.Int),
    money: T.Float,
});
export type Corporation = ModelType<typeof TCorporation>;


export const TUser = T.Object({
    userId: T.Int,
    name: T.String
})
export type User = ModelType<typeof TUser>;


export const TConnection = T.Object({
    left: T.Int,
    right: T.Int
})
export type Connection = ModelType<typeof TConnection>;


export const TNodeType = T.Enum('EXTRACTION', 'POPULATION', 'DEPOT', 'FACTORY');
export type NodeType = ModelType<typeof TNodeType>;

export const TNode = T.Object({
    nodeId: T.Int,
    type: TNodeType,
    name: T.String,
    vertexId: T.Int,
    countryId: T.Int,
    size: T.Float,
    buildingIds: T.Array(T.Int)
});
export type Node = ModelType<typeof TNode>;


export const TCountryType = T.Enum('SINGLE_LEADER', 'MULTI_LEADER')
export type CountryType = ModelType<typeof TCountryType>;

export const TCountry = T.Object({
    countryId: T.Int,
    name: T.String,
    nodeIds: T.Array(T.Int),
    type: TCountryType,
    money: T.Float,
    points: T.Float,
    leaders: T.Array(TOwner)
});
export type Country = ModelType<typeof TCountry>;


export const TPerson = T.Object({
    personId: T.Int,
    userId: T.Optional(T.Int),
    name: T.String,
    companyIds: T.Array(T.Int),
    stakeIds: T.Array(T.Int),
    countryIds: T.Array(T.Int) // leader of a country
});
export type Person = ModelType<typeof TPerson>;


export const TGraph = T.Object({
    graphId: T.Int,
    nodes: T.Record(T.Int, TNode),
    connections: T.Array(TConnection),
    vertices: T.Record(T.Int, TVertex),
    zones: T.Record(T.Int, TZone)
});
export type Graph = ModelType<typeof TGraph>;

export const TGame = T.Object({
    gameId: T.Int,
    graph: TGraph,
    users: T.Record(T.Int, TUser),
    companies: T.Record(T.Int, TCompany),
    corporations: T.Record(T.Int, TCorporation),
    countries: T.Record(T.Int, TCountry),
    people: T.Record(T.Int, TPerson),
    stakes: T.Record(T.Int, TStake),
    buildings: T.Record(T.Int, TBuilding),
    me: T.Optional(T.Int) // id of a person
});
export type Game = ModelType<typeof TGame>;
