pipeline {
    agent any

    environment {
        REGISTRY = 'yoonjini/ktb-travel-client' // Docker Hub 레지스트리 이름
        IMAGE_TAG = "${env.BUILD_NUMBER}" // 이미지 태그는 빌드 번호로 설정
        DOCKER_IMAGE = "${REGISTRY}:${IMAGE_TAG}"
        S3_BUCKET = "zero-dang.com" // S3 버킷 이름
        AWS_CREDENTIALS = credentials('aws-s3-credentials') // AWS 자격증명
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials') // Docker Hub 자격증명
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: 'dev']],
                          userRemoteConfigs: [[url: 'https://github.com/ktb-9/travel-web.git', credentialsId: 'riffletrip-github-app']]
                ])
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials') {
                        sh """
                        docker build -t $DOCKER_IMAGE .
                        docker push $DOCKER_IMAGE
                        """
                    }
                }
            }
        }

        stage('Run and Export Static Files') {
            steps {
                script {
                    sh """
                    docker run --rm -v $PWD/out:/app/out $DOCKER_IMAGE sh -c "
                    npm run export &&
                    cp -r /app/out /out
                    "
                    """
                }
            }
        }

         stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-s3-credentials') {
                    sh """
                    aws s3 sync out s3://$S3_BUCKET --delete
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs() // 작업공간 정리
        }
    }
}