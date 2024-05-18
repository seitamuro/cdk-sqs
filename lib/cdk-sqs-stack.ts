import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkSqsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda用のIAMロールを作成
    const lambdaSQSQueueExecutionRole = new iam.Role(this, "lambda-sqs-role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    lambdaSQSQueueExecutionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaSQSQueueExecutionRole"
      )
    );

    // SQSキューを作成
    const sqsQueue = new sqs.Queue(this, "MyQueue", {});
    const eventSource = new cdk.aws_lambda_event_sources.SqsEventSource(
      sqsQueue
    );

    // Lambda関数を作成
    const lambdaFunction = new lambda.Function(this, "Lambda", {
      code: new lambda.AssetCode("lib/lambda"),
      handler: "function.handler",
      runtime: lambda.Runtime.NODEJS_16_X,
      role: lambdaSQSQueueExecutionRole,
    });
    lambdaFunction.addEventSource(eventSource);
  }
}
