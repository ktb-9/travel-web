pipeline {
    agent any

    environment {
        REGISTRY = 'yoonjini/ktb-travel-client'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE = "${REGISTRY}:${IMAGE_TAG}"
        S3_BUCKET = "zero-dang.com" // S3 버킷 이름
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials') // Docker Hub 자격증명
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/dev']],
                          userRemoteConfigs: [[url: 'https://github.com/ktb-9/travel-web.git', credentialsId: 'riffletrip-github-app2']]
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

         stage('Update Helm Chart in Infra Branch') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'travel-jenkins-prac', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh '''
                        git config --global user.email "skyj217@gmail.com"
                        git config --global user.name "iyxxnjin"
                        git checkout infra
                        sed -i "s/tag:.*/tag: ${IMAGE_TAG}/g" helm/values.yaml
                        git add helm/values.yaml
                        git commit -m "Chore: update image tag to ${IMAGE_TAG}" || echo "No changes to commit"
                        git push https://${GIT_USER}:${GIT_PASS}@github.com/ktb-9/travel-web.git infra
                        '''
                    }
                }
            }
        }


        stage('ArgoCD Sync') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                        sh '''
                        argocd login argocd.zero-dang.com --username ${ARGOCD_USER} --password ${ARGOCD_PASS} --insecure
                        argocd app sync riffletrip-app
                        '''
                    }
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