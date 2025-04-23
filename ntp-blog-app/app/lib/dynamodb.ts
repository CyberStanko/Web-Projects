const fs = require("fs");
const path = require("path");
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in the environment variables."
  );
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

console.log(
  process.env.AWS_REGION,
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY,
  "aaaaaaaaaa"
);

console.log("GetItemCommand:", GetItemCommand); // Debugging line
console.log(
  "AWS SDK Version:",
  require("@aws-sdk/lib-dynamodb/package.json").version
);

interface DynamoDBMessage {
  payload: {
    application: string;
    history_id: string;
    created_at: string;
    updated_at: string;
    user_email: string;
    status: string;
  };
  context_user: string;
}

export async function createItem(tableName: string, msg: DynamoDBMessage) {
  console.log("Starting createItem operation");
  console.log("Create Item:", msg.payload);
  console.log("Table Name:", tableName);

  const command = new PutCommand({
    TableName: tableName,
    Item: {
      application: msg.payload.application,
      history_id: msg.payload.history_id,
      created_at: msg.payload.created_at,
      updated_at: msg.payload.updated_at,
      user_email: msg.payload.user_email,
      status: msg.payload.status,
    },
  });

  try {
    const result = await docClient.send(command);
    console.log("PutCommand result:", result);
    return result;
  } catch (error) {
    console.error("Error in createItem:", error);
    throw error;
  }
}

export async function updateBlogStatus(
  blogId: string,
  status: string,
  userEmail: string
) {
  console.log("Updating blog status in DynamoDB:", {
    blogId,
    status,
    userEmail,
  });

  try {
    // First, get the current item to ensure it exists
    const getCommand = new GetCommand({
      TableName: "Ntp-blog-app-Testing",
      Key: {
        application: "history",
        history_id: blogId,
      },
    });

    const existingItem = await docClient.send(getCommand);
    console.log("Existing item:", existingItem);

    if (!existingItem.Item) {
      // If item doesn't exist, create it
      const createCommand = new PutCommand({
        TableName: "Ntp-blog-app-Testing",
        Item: {
          application: "history",
          history_id: blogId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_email: userEmail,
          status: status,
        },
      });

      const result = await docClient.send(createCommand);
      console.log("Created new blog history item:", result);
      return result;
    }

    // Update the existing item
    const updateCommand = new UpdateCommand({
      TableName: "Ntp-blog-app-Testing",
      Key: {
        application: "history",
        history_id: blogId,
      },
      UpdateExpression: "SET #s = :status, #ua = :updatedAt",
      ExpressionAttributeNames: {
        "#s": "status",
        "#ua": "updated_at",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(updateCommand);
    console.log("Successfully updated blog status in DynamoDB:", result);
    return result;
  } catch (error) {
    console.error("Error updating blog status in DynamoDB:", error);
    throw error;
  }
}

export async function getAllItems(tableName: string) {
  console.log("Fetching all items from DynamoDB:", { tableName });

  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "application = :app",
    ExpressionAttributeValues: {
      ":app": "history",
    },
  });

  try {
    const result = await docClient.send(command);
    console.log("Fetched items:", result.Items);
    return result.Items || [];
  } catch (error) {
    console.error("Error fetching items from DynamoDB:", error);
    throw error;
  }
}
