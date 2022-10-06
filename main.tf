terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  root                  = "source"
  fold                  = "fuse"
  environment           = "dev"
  cidr_block            = "10.0.0.0/16"
  availability_zones    = var.availability_zones
  container_definitions = var.container_definitions
}

# Deploy the VPC
module "vpc" {
  source  = "cloudposse/vpc/aws"
  version = "1.2.0"

  namespace = local.root
  stage     = local.environment
  name      = local.fold

  ipv4_primary_cidr_block = local.cidr_block
  assign_generated_ipv6_cidr_block = true
}

# Deploy public and private subnets into the VPC
module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  version = "0.39.0"

  namespace           = local.root
  stage               = local.environment
  name                = local.fold
  vpc_id              = module.vpc.vpc_id
  igw_id              = module.vpc.igw_id
  cidr_block          = local.cidr_block
  availability_zones  = local.availability_zones
}

# Deploy the Fargate cluster
module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "4.1.1"

  cluster_name = local.environment

  cluster_configuration = {
    execute_command_configuration = {
      logging = "OVERRIDE"
      log_configuration = {
        cloud_watch_log_group_name = "/aws/ecs/aws-ec2"
      }
    }
  }

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
  }
}

# Deploy the Fargate service
module "service" {
  source  = "USSBA/easy-fargate-service/aws"
  version = "9.2.0"

  family       = "service"
  cluster_name = module.ecs.cluster_name

  container_definitions = local.container_definitions
}

# Deploy the S3 bucket
module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "3.4.0"

  bucket = "${local.root}-${local.environment}-${local.fold}"
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = true
  }
}

# Allow the Fargate service to put objects into the S3 bucket
data "aws_iam_policy_document" "main" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [module.service.task_role.arn]
    }

    actions = [
      "s3:PutObject"
    ]

    resources = [
      module.s3_bucket.s3_bucket_arn,
      "${module.s3_bucket.s3_bucket_arn}/*",
    ]
  }
}

# Link the IAM policy to the S3 bucket
resource "aws_s3_bucket_policy" "main" {
  bucket = module.s3_bucket.s3_bucket_id
  policy = data.aws_iam_policy_document.main.json
}

# Output the DNS address of the Fargate service
output "service_dns_address" {
  value = module.service.alb_dns
}