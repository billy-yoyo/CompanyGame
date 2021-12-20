-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('EXTRACTION', 'POPULATION', 'DEPOT', 'FACTORY');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('MINE', 'LUMBERYARD', 'WAREHOUSE');

-- CreateTable
CREATE TABLE "Graph" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Graph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphNode" (
    "id" SERIAL NOT NULL,
    "graphId" INTEGER NOT NULL,
    "vertexId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "GraphNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphConnection" (
    "leftId" INTEGER NOT NULL,
    "rightId" INTEGER NOT NULL,

    CONSTRAINT "GraphConnection_pkey" PRIMARY KEY ("leftId","rightId")
);

-- CreateTable
CREATE TABLE "GraphZone" (
    "id" SERIAL NOT NULL,
    "graphId" INTEGER NOT NULL,

    CONSTRAINT "GraphZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphZoneVertex" (
    "zoneId" INTEGER NOT NULL,
    "vertexId" INTEGER NOT NULL,

    CONSTRAINT "GraphZoneVertex_pkey" PRIMARY KEY ("zoneId","vertexId")
);

-- CreateTable
CREATE TABLE "GraphVertex" (
    "id" SERIAL NOT NULL,
    "graphId" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "GraphVertex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" SERIAL NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "type" "BuildingType" NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyBuildingOwner" (
    "buildingId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "CompanyBuildingOwner_pkey" PRIMARY KEY ("buildingId","ownerId")
);

-- CreateTable
CREATE TABLE "CorporationBuildingOwner" (
    "buildingId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "CorporationBuildingOwner_pkey" PRIMARY KEY ("buildingId","ownerId")
);

-- CreateTable
CREATE TABLE "CountryBuildingOwner" (
    "buildingId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "CountryBuildingOwner_pkey" PRIMARY KEY ("buildingId","ownerId")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "buildingId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("buildingId","itemId")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "money" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorporationCompanyOwner" (
    "companyId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "CorporationCompanyOwner_pkey" PRIMARY KEY ("companyId","ownerId")
);

-- CreateTable
CREATE TABLE "PersonCompanyOwner" (
    "companyId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "PersonCompanyOwner_pkey" PRIMARY KEY ("companyId","ownerId")
);

-- CreateTable
CREATE TABLE "Corporation" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "money" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Corporation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonCorporationStakeholder" (
    "corporationId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "stakes" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PersonCorporationStakeholder_pkey" PRIMARY KEY ("corporationId","ownerId")
);

-- CreateTable
CREATE TABLE "CorporationCorporationStakeholder" (
    "corporationId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "CorporationCorporationStakeholder_pkey" PRIMARY KEY ("corporationId","ownerId")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "money" DOUBLE PRECISION NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryLeader" (
    "countryId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "CountryLeader_pkey" PRIMARY KEY ("countryId","personId")
);

-- CreateTable
CREATE TABLE "CountryNode" (
    "countryId" INTEGER NOT NULL,
    "nodeId" INTEGER NOT NULL,

    CONSTRAINT "CountryNode_pkey" PRIMARY KEY ("countryId","nodeId")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "userId" INTEGER,
    "name" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuth" (
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "passHash" TEXT NOT NULL,

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountryNode_nodeId_key" ON "CountryNode"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_username_key" ON "UserAuth"("username");

-- AddForeignKey
ALTER TABLE "Graph" ADD CONSTRAINT "Graph_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphNode" ADD CONSTRAINT "GraphNode_graphId_fkey" FOREIGN KEY ("graphId") REFERENCES "Graph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphNode" ADD CONSTRAINT "GraphNode_vertexId_fkey" FOREIGN KEY ("vertexId") REFERENCES "GraphVertex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphConnection" ADD CONSTRAINT "GraphConnection_leftId_fkey" FOREIGN KEY ("leftId") REFERENCES "GraphNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphConnection" ADD CONSTRAINT "GraphConnection_rightId_fkey" FOREIGN KEY ("rightId") REFERENCES "GraphNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphZone" ADD CONSTRAINT "GraphZone_graphId_fkey" FOREIGN KEY ("graphId") REFERENCES "Graph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphZoneVertex" ADD CONSTRAINT "GraphZoneVertex_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "GraphZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphZoneVertex" ADD CONSTRAINT "GraphZoneVertex_vertexId_fkey" FOREIGN KEY ("vertexId") REFERENCES "GraphVertex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphVertex" ADD CONSTRAINT "GraphVertex_graphId_fkey" FOREIGN KEY ("graphId") REFERENCES "Graph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "GraphNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyBuildingOwner" ADD CONSTRAINT "CompanyBuildingOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyBuildingOwner" ADD CONSTRAINT "CompanyBuildingOwner_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporationBuildingOwner" ADD CONSTRAINT "CorporationBuildingOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Corporation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporationBuildingOwner" ADD CONSTRAINT "CorporationBuildingOwner_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryBuildingOwner" ADD CONSTRAINT "CountryBuildingOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryBuildingOwner" ADD CONSTRAINT "CountryBuildingOwner_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporationCompanyOwner" ADD CONSTRAINT "CorporationCompanyOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Corporation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporationCompanyOwner" ADD CONSTRAINT "CorporationCompanyOwner_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCompanyOwner" ADD CONSTRAINT "PersonCompanyOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCompanyOwner" ADD CONSTRAINT "PersonCompanyOwner_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corporation" ADD CONSTRAINT "Corporation_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCorporationStakeholder" ADD CONSTRAINT "PersonCorporationStakeholder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCorporationStakeholder" ADD CONSTRAINT "PersonCorporationStakeholder_corporationId_fkey" FOREIGN KEY ("corporationId") REFERENCES "Corporation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporationCorporationStakeholder" ADD CONSTRAINT "CorporationCorporationStakeholder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Corporation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporationCorporationStakeholder" ADD CONSTRAINT "CorporationCorporationStakeholder_corporationId_fkey" FOREIGN KEY ("corporationId") REFERENCES "Corporation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLeader" ADD CONSTRAINT "CountryLeader_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLeader" ADD CONSTRAINT "CountryLeader_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryNode" ADD CONSTRAINT "CountryNode_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryNode" ADD CONSTRAINT "CountryNode_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "GraphNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuth" ADD CONSTRAINT "UserAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
