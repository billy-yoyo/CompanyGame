import T, { ModelType, Template } from "tsplate";
import * as game from "./game";

export const TArrayOptions = <M, T>(templ: Template<M, T>) => {
    return T.Optional(T.Object({
        add: T.Optional(T.Array(templ)),
        remove: T.Optional(T.Array(templ)),
        set: T.Optional(T.Array(templ)),
        update: T.Optional(T.Array(templ))
    }));
};

export const TNullable = <M, T>(templ: Template<M, T>) => T.Optional(T.Object({ v: templ }));


export const TUpdateBuilding = T.Object({
    buildingId: T.Int,
    nodeId: T.Optional(T.Int),
    type: T.Optional(game.TBuildingType),
    inventory: T.Optional(T.Record(T.Int, T.Int))
});
export type UpdateBuilding = ModelType<typeof TUpdateBuilding>;


export const TUpdateItem = T.Object({
    itemId: T.Int,
    type: T.Optional(game.TItemType)
});
export type UpdateItem = ModelType<typeof TUpdateItem>;


export const TUpdateVertex = T.Object({
    vertexId: T.Int,
    x: T.Optional(T.Float),
    y: T.Optional(T.Float)
});
export type UpdateVertex = ModelType<typeof TUpdateVertex>;


export const TUpdateZone = T.Object({
    zoneId: T.Int,
    type: T.Optional(game.TZoneType),
    vertexIds: TArrayOptions(T.Int)
});
export type UpdateZone = ModelType<typeof TUpdateZone>;


export const TUpdateOwner = T.Object({
    ownerId: T.Optional(T.Int),
    ownerType: T.Optional(game.TOwnerType)
});
export type UpdateOwner = ModelType<typeof TUpdateOwner>;


export const TUpdateStake = T.Object({
    stakeId: T.Int,
    corporationId: T.Optional(T.Int),
    personId: T.Optional(T.Int),
    stakes: T.Optional(T.Float)
});
export type UpdateStake = ModelType<typeof TUpdateStake>;


export const TUpdateCompany = T.Object({
    companyId: T.Int,
    name: T.Optional(T.String),
    buildingIds: TArrayOptions(T.Int),
    money: T.Optional(T.Float),
    owner: T.Optional(TUpdateOwner)
});
export type UpdateCompany = ModelType<typeof TUpdateCompany>;


export const TUpdateCorporation = T.Object({
    corporationId: T.Int,
    name: T.Optional(T.String),
    companyIds: TArrayOptions(T.Int),
    buildingIds: TArrayOptions(T.Int),
    stakeIds: TArrayOptions(T.Int),
    money: T.Optional(T.Float)
});
export type UpdateCorporation = ModelType<typeof TUpdateCorporation>;


export const TUpdateUser = T.Object({
    userId: T.Int,
    name: T.Optional(T.String)
});
export type UpdateUser = ModelType<typeof TUpdateUser>;


export const TUpdateConnection = T.Object({
    left: T.Optional(T.Int),
    right: T.Optional(T.Int)
});
export type UpdateConnection = ModelType<typeof TUpdateConnection>;


export const TUpdateNode = T.Object({
    nodeId: T.Int,
    type: T.Optional(game.TNodeType),
    name: T.Optional(T.String),
    vertexId: T.Optional(T.Int),
    countryId: T.Optional(T.Int),
    size: T.Optional(T.Float),
    buildingIds: TArrayOptions(T.Int)
});
export type UpdateNode = ModelType<typeof TUpdateNode>;


export const TUpdateCountry = T.Object({
    countryId: T.Int,
    name: T.Optional(T.String),
    nodeIds: TArrayOptions(T.Int),
    type: T.Optional(game.TCountryType),
    money: T.Optional(T.Float),
    points: T.Optional(T.Float),
    leaders: TArrayOptions(TUpdateOwner)
});
export type UpdateCountry = ModelType<typeof TUpdateCountry>;


export const TUpdatePerson = T.Object({
    personId: T.Int,
    userId: TNullable(T.Int),
    name: T.Optional(T.String),
    companyIds: TArrayOptions(T.Int),
    stakeIds: TArrayOptions(T.Int),
    countryIds: TArrayOptions(T.Int)
});
export type UpdatePerson = ModelType<typeof TUpdatePerson>;


export const TUpdateGraph = T.Object({
    nodes: TArrayOptions(game.TNode),
    connections: TArrayOptions(game.TConnection),
    vertices: TArrayOptions(game.TVertex),
    zones: TArrayOptions(game.TZone)
});
export type UpdateGraph = ModelType<typeof TUpdateGraph>;


export const TUpdateGame = T.Object({
    graph: T.Optional(TUpdateGraph),
    users: TArrayOptions(game.TUser),
    companies: TArrayOptions(game.TCompany),
    corporations: TArrayOptions(game.TCorporation),
    countries: TArrayOptions(game.TCountry),
    people: TArrayOptions(game.TPerson),
    stakes: TArrayOptions(game.TPerson),
    buildings: TArrayOptions(game.TBuilding),
    me: TNullable(T.Int)
});
export type UpdateGame = ModelType<typeof TUpdateGame>;


export const TPacket = (templ: Template<any, any>) => T.Object({
    dataType: T.String,
    data: templ
});
