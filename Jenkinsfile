pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker_login')
        DOCKERHUB_REPO = 'divanshreevatsa/jenkins_test_docker'
    }

    stages {
        stage('Build and Push Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t $DOCKERHUB_REPO:backend .'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $DOCKERHUB_REPO:backend'
                }
            }
        }

        stage('Build and Push Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $DOCKERHUB_REPO:frontend .'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $DOCKERHUB_REPO:frontend'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose pull'  // Pull the images from Docker Hub
                sh 'docker-compose up -d' // Run the containers
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
