# React Native and AppSync - Template

This app demonstrates how to integrate React Native & GraphQL using [AppSync](https://aws.amazon.com/appsync/) with optimistic UI and real time subscriptions.
[AppSync](https://aws.amazon.com/appsync/) is part of [AWS Mobile](https://aws.amazon.com/mobile/)

To view the tutorial for how to build this app, see both [part 1](https://code.tutsplus.com/tutorials/code-an-app-with-graphql-and-react-native--cms-30511) and [part 2](https://code.tutsplus.com/tutorials/code-an-app-with-graphql-react-native-and-aws-appsync-the-app--cms-30569) on Tuts Plus. Also follow the instruction below to setup environment for using template.

![React Native AppSync](https://i.imgur.com/X3zmWGS.jpg)
![react_native](https://github.com/Luffyingw/bigbang-mobile/raw/master/assets/iOS.gif）

### Environment setup
1. install react-native-cli@2.0.1
2. install node@latest (mine is v8.11.1). It comes with npm (mine is 5.6.0)
3. install git
4. install vscode IDE (with powerful extensions and all-in-one view. debuggable in IDE instead of browser. Debugger runner integrated with react-native). Install "React-Native tools" extension.
5. Have an aws account.


### To get started    

1. clone project    

```
git clone git@github.com:Luffyingw/bigbang-mobile.git
```

2. change into directory and install dependencies    

```
cd bigbang-mobile && yarn || cd bigbang-mobile && npm install
```

3. install storybook and start storybook server
```
cd bigbang-mobile
npm i -g @storybook/cli
getstorybook
yarn run storybook
```

3. Update credentials in `./aws-exports` (endpoint, APIkey)   

4. Run project in either iOS or Android simulators 
It will download necessary ios/andriod dependencies and build the code
```
react-native run-ios 
or
react-native run-android
```
A simulator should open (like a cellphone screen) if everything goes through.


___



## AWS AppSync Configuration   

For this to work, you must have the following AppSync Schema as well as the `cityId-index` created in your LocationTable (see screenshot below). You must also have the correct resolver mapping template for the `listLocations` query.

#### listLocations request mapping template:    

```
{
    "version": "2017-02-28",
    "operation": "Query",
    "index": "cityId-index",
    "query": {
        "expression": "cityId = :cityId",
        "expressionValues": {
            ":cityId": {
                "S": "$ctx.args.cityId"
            }
        }
    },
    "limit": #if($context.arguments.limit) $context.arguments.limit #else 10 #end,
    "nextToken": #if($context.arguments.nextToken) "$context.arguments.nextToken" #else null #end
}
```

#### Schema    

```
type City {
	id: ID!
	name: String!
	country: String!
	locations: [Location]
}

type CityConnection {
	items: [City]
	nextToken: String
}

input CreateCityInput {
	id: ID!
	name: String!
	country: String!
}

input CreateLocationInput {
	id: ID!
	cityId: ID!
	name: String!
	info: String
}

input DeleteCityInput {
	id: ID!
}

input DeleteLocationInput {
	id: ID!
}

type Location {
	id: ID!
	cityId: ID!
	name: String!
	info: String
}

type LocationConnection {
	items: [Location]
	nextToken: String
}

type Mutation {
	createCity(input: CreateCityInput!): City
	updateCity(input: UpdateCityInput!): City
	deleteCity(input: DeleteCityInput!): City
	createLocation(input: CreateLocationInput!): Location
	updateLocation(input: UpdateLocationInput!): Location
	deleteLocation(input: DeleteLocationInput!): Location
}

type Query {
	getCity(id: ID!): City
	listCities(first: Int, after: String): CityConnection
	getLocation(id: ID!): Location
	listLocations(cityId: ID!, first: Int, after: String): LocationConnection
}

type Subscription {
	onCreateCity(id: ID, name: String, country: String): City
		@aws_subscribe(mutations: ["createCity"])
	onUpdateCity(id: ID, name: String, country: String): City
		@aws_subscribe(mutations: ["updateCity"])
	onDeleteCity(id: ID, name: String, country: String): City
		@aws_subscribe(mutations: ["deleteCity"])
	onCreateLocation(
		id: ID,
		cityId: ID,
		name: String,
		info: String
	): Location
		@aws_subscribe(mutations: ["createLocation"])
	onUpdateLocation(
		id: ID,
		cityId: ID,
		name: String,
		info: String
	): Location
		@aws_subscribe(mutations: ["updateLocation"])
	onDeleteLocation(
		id: ID,
		cityId: ID,
		name: String,
		info: String
	): Location
		@aws_subscribe(mutations: ["deleteLocation"])
}

input UpdateCityInput {
	id: ID!
	name: String
	country: String
}

input UpdateLocationInput {
	id: ID!
	cityId: ID
	name: String
	info: String
}

schema {
	query: Query
	mutation: Mutation
	subscription: Subscription
}
```

### LocationTable index configuration

![](https://i.imgur.com/W05xPFo.png)

### Set cloudwatch on tables. Change read/write unit capacity if need.
