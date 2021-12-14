
# Company Game

1. World is split into countries, companies and corporations
1. World is also split up into resource zones
1. "Nodes" are built on the world which represent all the types of buildings:
    1. Resource exploitation (e.g. mines, lumberyards)
    1. Population centre (e.g. village, town, city)
    1. Depots (e.g. warehouses)
    1. Factories
1. Connections are built between the nodes, with connections having maximum lengths depending on the terminal node types
1. All of these can be player controlled
1. Players are started with a single company (e.g. mining).
1. Companies can own buildings and resources (e.g. a mine, a warehouse, a processing plant). They are ran by a single person.
1. Corporations can own companies, and can also own resources. They are run by a group of stakeholders, or a single person if they are private.
1. Countries contain companies (companies cannot cross international borders). Coorporations can, unless a country forbids them.
1. Countries own land, they tax on trades that happen within their borders, and have ultimate power to allow or disallow the selling and use of land. A countries aim is to produce certain types of resources to complete quests, which award them with points they can spend improving their country and ultimately winning the game.
1. 

# Phases

## Phase 1

Create data model

1. Create graph data model
    1. game id
    1. id
    1. a list of node ids
    1. a list of connections (2 node ids)
    1. a list of vertex ids
    1. a list of zone ids
1. Create node model
    1. id
    1. type (extraction, population, depot, factory)
    1. name
    1. owner id
    1. vertex id
    1. size (determins how close nodes can be together)
    1. buildings (a list of building ids which are at this node)
    1. country id
1. Create building model
    1. id
    1. type (mine, lumberyard, warehouse)
    1. inventory (a map of item ids and counts)
    1. node id
1. Create item model
    1. id
    1. type (ore, wood, etc.)
1. Create vertex model
    1. id
    1. x, y
1. Create zone model
    1. id
    1. type (resource, country)
    1. list of vertex ids
1. Create company model
    1. game id
    1. id
    1. name
    1. building ids
    1. money
    1. contract ids
    1. owner id
1. Create corporation model
    1. game id
    1. id
    1. name
    1. company ids
    1. building ids
    1. stakeholder ids (list of owner ids)
    1. money
    1. contract ids
1. Create corporation stock model
    1. corporation id
    1. stock amount
    1. owner id
1. Create country model
    1. game id
    1. id
    1. name
    1. list of node ids
    1. country type (single leader, multiple leader)
    1. money
    1. points
    1. leader ids (list of owner ids)
1. Create person model
    1. game id
    1. user id (if person is player controlled)
    1. id
    1. name
    1. company ids (if owner of company)
    1. corporation ids (if stakeholder in corporations)
    1. country ids (if leader of country)
1. create owner model
    1. id
    1. owner id
    1. owner type (person, corporation, country)
1. Create contract signator model
    1. id
    1. signator id
    1. signator type (person, corporation, company, country)
1. Create contract model
    1. id
    1. signator ids
    1. type (land contract, trade contract, etc.)
    1. contract term ids
1. Create contract term model
    1. id
    1. contract id
    1. term (a string encoding the term)
1. Create user model
    1. id
    1. username
    1. email
    1. password hash
1. Create game model
    1. game id
    1. graph id
    1. company ids
    1. corporation ids
    1. country ids
    1. person ids

## Phase 2

Create client:

1. Create a map view which can:
    1. Show nodes
    1. Show connections
    1. Show zones
    1. Scroll & Zoom
    1. Loop
1. Create a window API which allows you to:
    1. Create and open windows with custom titles and content
    1. Have an API for filling window with some default components
        1. Text box
        1. Number field
        1. Button
        1. List
    1. Create an API for laying out these windows (e.g. attaching to each other, sticking to sides of screen, etc.)
1. Create windows for the following data:
    1. Person
    1. Company
    1. Corporation
    1. Company
    1. Node
    1. Building
    1. Zone

## Phase 3:

Create server:

1. Set up a basic server with a relational database
    1. Set up boiler plate for a HTTP server
    1. Set up boiler plate for a relational database
    1. Create schemas for the data models
1. Create API for logging in and joining game
    1. login
    1. logout
    1. signup
    1. join game
    1. get game
1. Create websocket connection for game
    1. Create an API via the websocket for partial updates to the game state
1. Create server-side game logic for progressing the game
    1. Resources get produced
    1. Resources get moved
    1. Resources get traded
    1. Factories produce
    1. Contracts tick
1. Create an API for handling transactions
    1. Create some way of describing transactions
        1. buy/sell resources
        1. buy/sell companies
        1. buy/sell buildings
        1. buy/sell stocks