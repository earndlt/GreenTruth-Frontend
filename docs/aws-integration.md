
# AWS Integration Guide

This document details how to integrate GreenTruth with AWS EC2 and S3 services, which are part of your existing infrastructure.

---

## AWS EC2 Integration

GreenTruth can be deployed on EC2 instances for complete control over the runtime environment.

### Architecture Diagram

```
┌────────────────┐      ┌──────────────┐      ┌──────────────┐
│  Application   │      │              │      │              │
│  Load Balancer │─────▶│  EC2 Cluster │─────▶│  RDS/Aurora  │
│                │      │  GreenTruth  │      │  (Optional)  │
└────────────────┘      └──────────────┘      └──────────────┘
        │                       │                     │
        │                       │                     │
        ▼                       ▼                     ▼
┌────────────────┐      ┌──────────────┐      ┌──────────────┐
│  WAF/Shield    │      │  Auto-Scaling│      │  CloudWatch  │
│  (Security)    │      │  Group       │      │  Monitoring  │
└────────────────┘      └──────────────┘      └──────────────┘
```

### EC2 Instance Requirements

For production deployments:

| Component     | Minimum Requirement      | Recommended                 |
|---------------|--------------------------|----------------------------|
| Instance Type | t3.large (2 vCPU, 8 GiB) | c5.xlarge (4 vCPU, 8 GiB)  |
| AMI           | Amazon Linux 2023        | Amazon Linux 2023          |
| Storage       | 50 GB gp3 (3000 IOPS)    | 100 GB gp3 (5000 IOPS)     |
| Network       | Enhanced Networking      | Enhanced Networking        |

### Deployment Process

1. **Launch EC2 Instance** with the following CloudFormation template:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  GreenTruthInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: c5.xlarge
      ImageId: ami-0c55b159cbfafe1f0  # Amazon Linux 2023 (update as needed)
      SecurityGroups:
        - !Ref GreenTruthSecurityGroup
      KeyName: my-key-pair
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash -xe
          yum update -y
          yum install -y docker git
          systemctl start docker
          systemctl enable docker
          curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
          chmod +x /usr/local/bin/docker-compose
          
          # Clone GreenTruth repository
          git clone https://github.com/your-org/greentruth.git /opt/greentruth
          
          # Configure environment
          cat > /opt/greentruth/.env <<EOL
          NODE_ENV=production
          SUPABASE_URL=${SupabaseUrl}
          SUPABASE_KEY=${SupabaseKey}
          EARNDLT_API_URL=${EarnDLTApiUrl}
          EARNDLT_API_KEY=${EarnDLTApiKey}
          MONGODB_URI=${MongoDbUri}
          PINECONE_API_KEY=${PineconeApiKey}
          PINECONE_ENVIRONMENT=${PineconeEnvironment}
          EOL
          
          # Start the application
          cd /opt/greentruth
          docker-compose up -d
          
  GreenTruthSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Enable HTTP/HTTPS and SSH access
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0  # Restrict this in production
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
```

2. **Configure Auto Scaling** for high availability:

```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name greentruth-asg \
  --launch-configuration-name greentruth-launch-config \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-a1b2c3d4,subnet-e5f6g7h8" \
  --target-group-arns "arn:aws:elasticloadbalancing:region:account-id:targetgroup/greentruth-targets/12345678"
```

3. **Set Up Load Balancer**:

```bash
aws elbv2 create-load-balancer \
  --name greentruth-alb \
  --subnets subnet-a1b2c3d4 subnet-e5f6g7h8 \
  --security-groups sg-12345678
```

### EC2 Monitoring Setup

Implement CloudWatch monitoring for your GreenTruth deployment:

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name GreenTruth_HighCPU \
  --alarm-description "Alarm when CPU exceeds 70%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=AutoScalingGroupName,Value=greentruth-asg \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:region:account-id:GreenTruthAlerts
```

---

## AWS S3 Integration

GreenTruth uses S3 for secure document storage and retrieval.

### Bucket Structure

Create the following buckets:

```bash
# Document storage
aws s3 mb s3://greentruth-documents-${ENVIRONMENT}

# Export files
aws s3 mb s3://greentruth-exports-${ENVIRONMENT}

# Backup storage
aws s3 mb s3://greentruth-backups-${ENVIRONMENT}
```

### S3 Bucket Configuration

1. **Enable Versioning**:
```bash
aws s3api put-bucket-versioning \
  --bucket greentruth-documents-prod \
  --versioning-configuration Status=Enabled
```

2. **Configure Encryption**:
```bash
aws s3api put-bucket-encryption \
  --bucket greentruth-documents-prod \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        },
        "BucketKeyEnabled": true
      }
    ]
  }'
```

3. **Set up Lifecycle Rules**:
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket greentruth-exports-prod \
  --lifecycle-configuration '{
    "Rules": [
      {
        "ID": "Delete old exports",
        "Status": "Enabled",
        "Prefix": "",
        "Expiration": {
          "Days": 30
        }
      }
    ]
  }'
```

### CORS Configuration

For frontend uploads, configure CORS:

```bash
aws s3api put-bucket-cors \
  --bucket greentruth-documents-prod \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["https://app.greentruth.com"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
      }
    ]
  }'
```

### Document Upload Implementation

GreenTruth provides both direct and pre-signed URL upload paths:

1. **Direct Upload** (server-side):

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-west-2',
  credentials: {
    accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')
  }
});

export async function uploadDocument(fileBuffer, fileName, metadata = {}) {
  const key = `documents/${uuid()}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: 'greentruth-documents-prod',
    Key: key,
    Body: fileBuffer,
    ContentType: getContentType(fileName),
    Metadata: {
      ...metadata,
      uploadTimestamp: new Date().toISOString()
    }
  });
  
  await s3Client.send(command);
  
  return {
    key,
    url: `https://greentruth-documents-prod.s3.amazonaws.com/${encodeURIComponent(key)}`
  };
}
```

2. **Pre-signed URL** approach (browser upload):

```typescript
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function generateUploadUrl(fileName, contentType, metadata = {}) {
  const key = `documents/${uuid()}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: 'greentruth-documents-prod',
    Key: key,
    ContentType: contentType,
    Metadata: metadata
  });
  
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
  return {
    uploadUrl: signedUrl,
    key,
    expiresIn: 3600,
    downloadUrl: `https://greentruth-documents-prod.s3.amazonaws.com/${encodeURIComponent(key)}`
  };
}
```

### Document Retrieval

GreenTruth supports both direct links and pre-signed download URLs:

```typescript
export async function getDocumentDownloadUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: 'greentruth-documents-prod',
    Key: key
  });
  
  return getSignedUrl(s3Client, command, { expiresIn });
}
```

### IAM Policy Recommendations

Create a dedicated IAM user with restricted permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::greentruth-documents-prod/*",
        "arn:aws:s3:::greentruth-exports-prod/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::greentruth-documents-prod",
        "arn:aws:s3:::greentruth-exports-prod"
      ]
    }
  ]
}
```

---

## CloudFront Integration

For enhanced content delivery and security, integrate CloudFront:

```bash
aws cloudfront create-distribution \
  --origin-domain-name greentruth-documents-prod.s3.amazonaws.com \
  --default-cache-behavior '{
    "TargetOriginId": "S3-greentruth-documents-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "CachedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    }
  }'
```

---

## Backup Strategy

Configure automated backups:

1. **Daily Database Exports**:

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
pg_dump -U username -d greentruth | gzip > /tmp/greentruth-backup-$TIMESTAMP.sql.gz
aws s3 cp /tmp/greentruth-backup-$TIMESTAMP.sql.gz s3://greentruth-backups-prod/database/greentruth-backup-$TIMESTAMP.sql.gz
```

2. **Document Replication**:

```bash
aws s3 sync s3://greentruth-documents-prod s3://greentruth-backups-prod/documents/$(date +%Y%m%d)/
```

---

## Disaster Recovery

GreenTruth's AWS integration supports point-in-time recovery:

1. **Recovery Time Objective (RTO)**: 1 hour
2. **Recovery Point Objective (RPO)**: 24 hours

Recovery procedure:

```bash
# 1. Restore database
gunzip -c s3://greentruth-backups-prod/database/latest.sql.gz | psql -U username -d greentruth_restored

# 2. Restore documents if needed
aws s3 sync s3://greentruth-backups-prod/documents/latest/ s3://greentruth-documents-prod/
```

---

## Security Best Practices

1. **Encryption**:
   - Enable S3 default encryption (AES-256 or KMS)
   - Use HTTPS for all CloudFront distributions

2. **Access Control**:
   - Implement least privilege IAM policies
   - Enable S3 bucket public access blocking
   - Use VPC endpoints for EC2 to S3 communication

3. **Monitoring**:
   - Enable S3 access logging
   - Configure CloudTrail for API monitoring
   - Set up CloudWatch alarms for unusual access patterns

4. **Compliance**:
   - Implement bucket policies for regulatory requirements
   - Enable Object Lock for WORM (Write Once Read Many) compliance
   - Configure lifecycle rules for retention requirements
