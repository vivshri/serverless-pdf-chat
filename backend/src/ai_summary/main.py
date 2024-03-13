import os, json
import boto3
from aws_lambda_powertools import Logger
from langchain.llms.bedrock import Bedrock
from langchain.memory.chat_message_histories import DynamoDBChatMessageHistory
from langchain.memory import ConversationBufferMemory
from langchain.embeddings import BedrockEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain


MEMORY_TABLE = os.environ["MEMORY_TABLE"]
BUCKET = os.environ["BUCKET"]


s3 = boto3.client("s3")
logger = Logger()


# @logger.inject_lambda_context(log_event=True)
# def lambda_handler(event, context):
#     event_body = json.loads(event["body"])
#     file_name = event_body["fileName"]
#     human_input = event_body["prompt"]
#     conversation_id = event["pathParameters"]["conversationid"]

# def main(event, context):
def main():
    # event_body = json.loads(event["body"])
    file_name = "vivshri"
    # human_input = event_body["prompt"]
    # user_alias = event_body["user_alias"]
    human_input = "describe vivek"
    # conversation_id = event["pathParameters"]["conversationid"]

    # user = event["requestContext"]["authorizer"]["claims"]["sub"]
    user = "ALL"

    s3.download_file(BUCKET, f"{user}/{file_name}/index.faiss", "/tmp/index.faiss")
    s3.download_file(BUCKET, f"{user}/{file_name}/index.pkl", "/tmp/index.pkl")

    # prefix = f"user_data/{user_alias}"
    # response = s3.list_objects_v2(Bucket=BUCKET, Prefix=prefix)
    # for obj in response['Contents']:
    #     file_key = obj['Key']
    #     if "index.faiss" in file_key or "index.pkl" in file_key:
    #         file_type = "faiss" if "index.faiss" in file_key else "pkl"
    #         # Generate a unique local filename to avoid overwrites
    #         local_filename = f"/tmp/index_{file_type}_{int(time.time())}.{file_type}"
    #         s3.download_file(BUCKET, file_key, local_filename)
    conversation_id = "1234"

    bedrock_runtime = boto3.client(
        service_name="bedrock-runtime",
        region_name="us-east-1",
    )

    embeddings, llm = BedrockEmbeddings(
        model_id="amazon.titan-embed-text-v1",
        client=bedrock_runtime,
        region_name="us-east-1",
    ), Bedrock(
        model_id="anthropic.claude-v2", client=bedrock_runtime, region_name="us-east-1"
    )
    faiss_index = FAISS.load_local("/tmp/fsiss", embeddings, allow_dangerous_deserialization=True)

    message_history = DynamoDBChatMessageHistory(
        table_name=MEMORY_TABLE, session_id=conversation_id
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        chat_memory=message_history,
        input_key="question",
        output_key="answer",
        return_messages=True,
    )

    qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=faiss_index.as_retriever(),
        memory=memory,
        return_source_documents=True,
    )

    res = qa({"question": human_input, "chat_history": []})

    logger.info(res)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
        "body": json.dumps(res["answer"]),
    }

if __name__ == "__main__":
    print(main())