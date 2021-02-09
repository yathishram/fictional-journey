const { writeFile } = require('fs').promises
const { randomBytes } = require('crypto')
const Ceramic = require('@ceramicnetwork/http-client').default
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const { Ed25519Provider } = require('key-did-provider-ed25519')

const fromString = require('uint8arrays/from-string')

const CERAMIC_URL = 'https://ceramic.signchain.xyz'

const Profile = {
    "type": "object",
    "title": "Profile",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
      "name": {
        "type": "string",
        "title": "name",
        "maxLength": 150
      },
      "email": {
        "type": "string",
        "title": "email",
        "maxLength": 150
      },
      "bio": {
        "type": "string",
        "title": "bio",
        "maxLength": 200
      }
    }
  }

const Todo = {
    doctype: 'object',
    title: 'Todo Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      documents: {
        type: 'array',
        title: 'todos',
      },
    },
  };

async function run() {
  // The seed must be provided as an environment variable
  const seed = new Uint8Array(randomBytes(32))
  console.log("Created seed", seed)
  // Connect to the local Ceramic node
  const ceramic = new Ceramic(CERAMIC_URL)
  // Authenticate the Ceramic instance with the provider

  await ceramic.setDIDProvider(new Ed25519Provider(seed))

  // Publish the two schemas
  const [profileSchema, todoListSchema] = await Promise.all([
    publishSchema(ceramic, { content: Profile }),
    publishSchema(ceramic, { content: Todo }),
  ])

  console.log("Profile Schema", profileSchema)
  console.log("Todo Schema", todoListSchema)

  // Create the definition using the created schema ID
  const profileDefinition = await createDefinition(ceramic, {
    name: 'profile',
    description: 'Profile Schema',
    schema: profileSchema.commitId.toUrl(),
  })

  const todoDefinition = await createDefinition(ceramic, {
    name: 'Todo',
    description: 'Todo Schema',
    schema: todoListSchema.commitId.toUrl(),
  })

  // Write config to JSON file
  const config = {
    definitions: {
      profile: profileDefinition.id.toString(),
      todo: todoDefinition.id.toString()
    },
    schemas: {
      profile: profileSchema.commitId.toUrl(),
      todoList: todoListSchema.commitId.toUrl(),
    },
  }
  await writeFile('./config.json', JSON.stringify(config))

  console.log('Config written to src/config.json file:', config)
  process.exit(0)
}

run().catch(console.error)
